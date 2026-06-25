/** biome-ignore-all lint/complexity/useLiteralKeys: <> */

import { z } from "zod";

import { AbstractService } from "@/common/contracts";
import { ConflictException, NotFoundException } from "@/common/exceptions";
import type { PrismaClient } from "@/generated/client";
import { evaluateAnswerQueue } from "@/services/bullmq/queues";
import type { HumeService } from "@/services/hume";

import type {
  InterviewFinalizeInput,
  InterviewStartInput,
} from "./interview.schema";

const humeChatEventSchema = z.object({
  type: z.string(),
  chatId: z.string(),
  chatGroupId: z.string().optional(),
  messageText: z.string().optional(),
  role: z.string().optional(),
  emotionFeatures: z.string().optional(),
  metadata: z.string().optional(),
  timestamp: z.number().optional(),
});

type HumeChatEvent = z.infer<typeof humeChatEventSchema>;

const emotionScoresSchema = z.record(z.string(), z.number());

function parseEmotionScores(emotionFeatures: string | undefined) {
  if (!emotionFeatures) {
    return {};
  }

  try {
    return emotionScoresSchema.parse(JSON.parse(emotionFeatures));
  } catch {
    return {};
  }
}

export class InterviewService extends AbstractService {
  constructor(
    prisma: PrismaClient,
    private readonly hume: HumeService,
  ) {
    super(prisma);
  }

  async start(userId: string, input: InterviewStartInput) {
    const interview = await this.prisma.interview.create({
      data: {
        category: input.category,
        difficulty: input.difficulty,
        questionCount: input.questionCount,
        status: "IN_PROGRESS",
        userId,
      },
    });

    let questions = await this.prisma.question.findMany({
      where: {
        category: input.category,
        difficulty: input.difficulty,
      },
      take: input.questionCount,
    });

    const existingCount = questions.length;
    if (existingCount < input.questionCount) {
      const placeholders = Array.from(
        { length: input.questionCount - existingCount },
        (_, i) => ({
          category: input.category,
          difficulty: input.difficulty,
          text: `Question ${existingCount + i + 1} for ${input.category}`,
        }),
      );

      await this.prisma.question.createMany({ data: placeholders });

      questions = await this.prisma.question.findMany({
        where: {
          category: input.category,
          difficulty: input.difficulty,
        },
        take: input.questionCount,
        orderBy: { createdAt: "desc" },
      });
    }

    await this.prisma.interviewQuestion.createMany({
      data: questions.map((q, i) => ({
        interviewId: interview.id,
        questionId: q.id,
        sortOrder: i,
      })),
    });

    const [accessToken, configId] = await Promise.all([
      this.hume.getAccessToken(),
      this.hume.getOrCreateConfig(),
    ]);

    return {
      interviewId: interview.id,
      accessToken,
      configId,
      questionCount: questions.length,
      currentQuestion: 0,
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    };
  }

  async finalize(
    interviewId: string,
    userId: string | null,
    input: InterviewFinalizeInput,
  ) {
    await this._getInterviewForFinalize(interviewId, userId);

    const page = await this.hume.fetchChatEvents(input.chatId);

    const allEvents: HumeChatEvent[] = [];

    for await (const event of page) {
      const parsedEvent = humeChatEventSchema.safeParse(event);
      if (parsedEvent.success) {
        allEvents.push(parsedEvent.data);
      }
    }

    const interviewQuestions = await this.prisma.interviewQuestion.findMany({
      where: { interviewId },
      orderBy: { sortOrder: "asc" },
      include: { question: true },
    });

    const userMessages = allEvents.filter((e) => e.type === "USER_MESSAGE");

    for (
      let i = 0;
      i < Math.min(userMessages.length, interviewQuestions.length);
      i++
    ) {
      const msg = userMessages[i];
      const iq = interviewQuestions[i];
      if (!msg || !iq) continue;

      const scores = parseEmotionScores(msg.emotionFeatures);

      const fluencyScore = scores["fluency"] ?? null;
      const confidenceScore = scores["confidence"] ?? null;
      const sentimentScore = scores["sentiment"] ?? null;

      const answer = await this.prisma.answer.create({
        data: {
          transcript: msg.messageText ?? null,
          interviewQuestionId: iq.id,
          interviewId,
          humeChatId: input.chatId,
          humeChatGroupId: input.chatGroupId,
          feedback: {
            create: {
              emotionalTone: scores,
              fluencyScore,
              confidenceScore,
              sentimentScore,
              overallScore:
                fluencyScore != null && confidenceScore != null
                  ? (fluencyScore + confidenceScore) / 2
                  : null,
            },
          },
        },
      });

      await evaluateAnswerQueue.add("evaluate-answer", {
        answerId: answer.id,
        questionText: iq.question.text,
        transcript: msg.messageText ?? "",
        suggestedAnswer: iq.question.suggestedAnswer,
      });
    }

    await this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    return { success: true };
  }

  async linkChatToInterview(
    interviewId: string,
    chatId: string,
    chatGroupId: string,
  ) {
    const interview = await this.prisma.interview.findUnique({
      where: { id: interviewId },
      select: { id: true },
    });

    if (!interview) {
      throw new NotFoundException("Interview not found");
    }

    await this.prisma.interview.update({
      where: { id: interviewId },
      data: {
        humeChatId: chatId,
        humeChatGroupId: chatGroupId,
      },
    });
  }

  async finalizeByChatId(chatId: string, input: InterviewFinalizeInput) {
    const interview = await this.prisma.interview.findFirst({
      where: { humeChatId: chatId },
      orderBy: { createdAt: "desc" },
    });

    if (!interview) {
      throw new NotFoundException("No interview found for this chat session");
    }

    if (interview.status === "COMPLETED") {
      throw new ConflictException("Interview has already been finalized");
    }

    return this.finalize(interview.id, null, input);
  }

  async linkChat(
    interviewId: string,
    userId: string,
    chatId: string,
    chatGroupId: string,
  ) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
      select: { id: true },
    });

    if (!interview) {
      throw new NotFoundException("Interview not found");
    }

    await this.prisma.interview.update({
      where: { id: interview.id },
      data: {
        humeChatId: chatId,
        humeChatGroupId: chatGroupId,
      },
    });
  }

  async recordQuestion(chatId: string, questionNumber: number) {
    const interview = await this.prisma.interview.findFirst({
      where: { humeChatId: chatId },
      orderBy: { createdAt: "desc" },
    });

    if (!interview) return;

    await this.prisma.interview.update({
      where: { id: interview.id },
      data: { currentQuestion: questionNumber },
    });
  }

  async getProgress(interviewId: string, userId: string) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
      select: {
        currentQuestion: true,
        questionCount: true,
        status: true,
      },
    });

    if (!interview) {
      throw new NotFoundException("Interview not found");
    }

    return interview;
  }

  private async _getInterviewForFinalize(
    interviewId: string,
    userId: string | null,
  ) {
    const interview = await this.prisma.interview.findFirst({
      where:
        userId === null ? { id: interviewId } : { id: interviewId, userId },
      select: { id: true, status: true },
    });

    if (!interview) {
      throw new NotFoundException("Interview not found");
    }

    if (interview.status === "COMPLETED") {
      throw new ConflictException("Interview has already been finalized");
    }

    return interview;
  }
}
