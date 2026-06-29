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

const POSITIVE_EMOTIONS = [
  "Calmness",
  "Concentration",
  "Determination",
  "Satisfaction",
  "Contentment",
  "Joy",
  "Excitement",
  "Interest",
  "Pride",
  "Triumph",
  "Amusement",
  "Admiration",
  "Relief",
  "Love",
  "Awe",
  "Surprise (positive)",
];

const NEGATIVE_EMOTIONS = [
  "Anger",
  "Anxiety",
  "Confusion",
  "Sadness",
  "Fear",
  "Distress",
  "Disappointment",
  "Embarrassment",
  "Boredom",
  "Doubt",
  "Awkwardness",
  "Shame",
  "Guilt",
  "Tiredness",
  "Contempt",
  "Pain",
  "Horror",
  "Disgust",
];

function computeConfidence(scores: Record<string, number>): number | null {
  const determination = scores["Determination"] ?? 0;
  const calmness = scores["Calmness"] ?? 0;
  const concentration = scores["Concentration"] ?? 0;
  const anxiety = scores["Anxiety"] ?? 0;
  const doubt = scores["Doubt"] ?? 0;
  const embarrassment = scores["Embarrassment"] ?? 0;
  const interest = scores["Interest"] ?? 0;

  const confident = determination + calmness + concentration + interest;
  const anxious = anxiety + doubt + embarrassment;

  const raw = (confident - anxious + 4) / 8;
  return Math.round(Math.max(0, Math.min(100, raw * 100)));
}

function computeFluency(scores: Record<string, number>): number | null {
  const confusion = scores["Confusion"] ?? 0;
  const awkwardness = scores["Awkwardness"] ?? 0;
  const tiredness = scores["Tiredness"] ?? 0;
  const boredom = scores["Boredom"] ?? 0;

  const disfluent = confusion + awkwardness + tiredness + boredom;
  const raw = (1 - disfluent + 3) / 4;
  return Math.round(Math.max(0, Math.min(100, raw * 100)));
}

function computeSentiment(scores: Record<string, number>): number | null {
  const sumPos = POSITIVE_EMOTIONS.reduce((s, e) => s + (scores[e] ?? 0), 0);
  const sumNeg = NEGATIVE_EMOTIONS.reduce((s, e) => s + (scores[e] ?? 0), 0);
  const total = sumPos + sumNeg;
  if (total === 0) return null;
  return Math.round((sumPos / total) * 100);
}

function computeClarity(scores: Record<string, number>): number | null {
  const concentration = scores["Concentration"] ?? 0;
  const contemplation = scores["Contemplation"] ?? 0;
  const realization = scores["Realization"] ?? 0;
  const interest = scores["Interest"] ?? 0;
  const satisfaction = scores["Satisfaction"] ?? 0;
  const confusion = scores["Confusion"] ?? 0;
  const awkwardness = scores["Awkwardness"] ?? 0;
  const tiredness = scores["Tiredness"] ?? 0;
  const boredom = scores["Boredom"] ?? 0;
  const doubt = scores["Doubt"] ?? 0;

  const clear =
    concentration + contemplation + realization + interest + satisfaction;
  const unclear = confusion + awkwardness + tiredness + boredom + doubt;

  const raw = (clear - unclear + 5) / 10;
  return Math.round(Math.max(0, Math.min(100, raw * 100)));
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
        orderBy: { createdAt: "asc" },
      });
    }

    questions.sort((a, b) => a.text.localeCompare(b.text));

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

      const fluencyScore = computeFluency(scores);
      const confidenceScore = computeConfidence(scores);
      const sentimentScore = computeSentiment(scores);
      const clarityScore = computeClarity(scores);

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
              clarityScore,
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

  async getInterview(interviewId: string, userId: string) {
    const interview = await this.prisma.interview.findFirst({
      where: { id: interviewId, userId },
      include: {
        questions: {
          orderBy: { sortOrder: "asc" },
          include: {
            question: true,
            answers: {
              orderBy: { createdAt: "asc" },
              include: { feedback: true },
            },
          },
        },
      },
    });

    if (!interview) {
      throw new NotFoundException("Interview not found");
    }

    const allScores = interview.questions
      .flatMap((q) =>
        q.answers.flatMap((a) => a.feedback.map((f) => f.overallScore)),
      )
      .filter((s): s is number => s != null);

    const overallScore =
      allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : null;

    const durationSeconds =
      interview.startedAt && interview.completedAt
        ? Math.round(
            (interview.completedAt.getTime() - interview.startedAt.getTime()) /
              1000,
          )
        : null;

    return {
      id: interview.id,
      category: interview.category,
      difficulty: interview.difficulty,
      status: interview.status,
      questionCount: interview.questionCount,
      currentQuestion: interview.currentQuestion,
      startedAt: interview.startedAt.toISOString(),
      completedAt: interview.completedAt?.toISOString() ?? null,
      durationSeconds,
      overallScore,
      questions: interview.questions.map((iq) => ({
        id: iq.id,
        sortOrder: iq.sortOrder,
        text: iq.question.text,
        category: iq.question.category,
        difficulty: iq.question.difficulty,
        answers: iq.answers.map((a) => ({
          id: a.id,
          transcript: a.transcript,
          durationMs: a.durationMs,
          createdAt: a.createdAt.toISOString(),
          feedback: a.feedback.map((f) => ({
            id: f.id,
            overallScore: f.overallScore,
            fluencyScore: f.fluencyScore,
            clarityScore: f.clarityScore,
            confidenceScore: f.confidenceScore,
            fillerWordCount: f.fillerWordCount,
            sentimentScore: f.sentimentScore,
            relevanceScore: f.relevanceScore,
            technicalAccuracy: f.technicalAccuracy,
            detailLevel: f.detailLevel,
            strengths: f.strengths,
            improvements: f.improvements,
            idealAnswer: f.idealAnswer,
          })),
        })),
      })),
    };
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
