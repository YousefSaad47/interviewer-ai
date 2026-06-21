/** biome-ignore-all lint/complexity/useLiteralKeys: <> */

import { AbstractService } from "@/common/contracts";
import { ConflictException, NotFoundException } from "@/common/exceptions";
import type { PrismaClient } from "@/generated/client";
import { evaluateAnswerQueue } from "@/services/bullmq/queues";
import type { HumeService } from "@/services/hume";

import type {
  InterviewFinalizeInput,
  InterviewStartInput,
} from "./interview.schema";

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

  async finalize(interviewId: string, input: InterviewFinalizeInput) {
    const page = await this.hume.fetchChatEvents(input.chatId);

    const allEvents: Array<{
      type: string;
      chatId: string;
      chatGroupId?: string;
      messageText?: string;
      role?: string;
      emotionFeatures?: string;
      metadata?: string;
      timestamp: number;
    }> = [];

    for await (const event of page) {
      allEvents.push(event as unknown as (typeof allEvents)[number]);
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

      // Parse emotion features from the stringified JSON
      let scores: Record<string, number> = {};
      if (msg.emotionFeatures) {
        try {
          scores = JSON.parse(msg.emotionFeatures) as Record<string, number>;
        } catch {
          // Ignore parse errors
        }
      }

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

    return this.finalize(interview.id, input);
  }

  async linkChat(interviewId: string, chatId: string, chatGroupId: string) {
    await this.prisma.interview.update({
      where: { id: interviewId },
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

  async getProgress(interviewId: string) {
    const interview = await this.prisma.interview.findUniqueOrThrow({
      where: { id: interviewId },
      select: {
        currentQuestion: true,
        questionCount: true,
        status: true,
      },
    });

    return interview;
  }
}
