import type { Prisma, PrismaClient } from "@/generated/client";

import type { AdminInterviewsQuery } from "./admin-interviews.schema";

const adminInterviewListSelect = {
  id: true,
  category: true,
  difficulty: true,
  status: true,
  questionCount: true,
  currentQuestion: true,
  startedAt: true,
  completedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
  _count: {
    select: {
      answers: true,
    },
  },
  answers: {
    select: {
      feedback: {
        select: {
          overallScore: true,
        },
      },
    },
  },
} satisfies Prisma.InterviewSelect;

const adminInterviewDetailsSelect = {
  id: true,
  category: true,
  difficulty: true,
  status: true,
  questionCount: true,
  currentQuestion: true,
  startedAt: true,
  completedAt: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
  questions: {
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      sortOrder: true,
      followUpText: true,
      question: {
        select: {
          id: true,
          text: true,
          category: true,
          difficulty: true,
        },
      },
      answers: {
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: {
          id: true,
          transcript: true,
          durationMs: true,
          createdAt: true,
          feedback: {
            orderBy: [{ createdAt: "asc" }, { id: "asc" }],
            select: {
              id: true,
              overallScore: true,
              idealAnswer: true,
              strengths: true,
              improvements: true,
              fillerWordCount: true,
              fluencyScore: true,
              clarityScore: true,
              confidenceScore: true,
              relevanceScore: true,
              technicalAccuracy: true,
              detailLevel: true,
              sentimentScore: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.InterviewSelect;

export type AdminInterviewListRecord = Prisma.InterviewGetPayload<{
  select: typeof adminInterviewListSelect;
}>;

export type AdminInterviewDetailsRecord = Prisma.InterviewGetPayload<{
  select: typeof adminInterviewDetailsSelect;
}>;

export class AdminInterviewsRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public findAdminInterviews(query: AdminInterviewsQuery) {
    return this.prisma.interview.findMany({
      where: this._buildInterviewWhere(query),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [{ startedAt: "desc" }, { id: "desc" }],
      select: adminInterviewListSelect,
    });
  }

  public countAdminInterviews(query: AdminInterviewsQuery) {
    return this.prisma.interview.count({
      where: this._buildInterviewWhere(query),
    });
  }

  public findAdminInterviewDetailsById(interviewId: string) {
    return this.prisma.interview.findUnique({
      where: { id: interviewId },
      select: adminInterviewDetailsSelect,
    });
  }

  private _buildInterviewWhere(
    query: AdminInterviewsQuery,
  ): Prisma.InterviewWhereInput {
    return {
      ...(query.userId && { userId: query.userId }),
      ...(query.status && { status: query.status }),
      ...(query.category && { category: query.category }),
      ...(query.difficulty && { difficulty: query.difficulty }),
      ...((query.from || query.to) && {
        startedAt: {
          ...(query.from && { gte: new Date(query.from) }),
          ...(query.to && { lte: new Date(query.to) }),
        },
      }),
      ...(query.search && {
        user: {
          OR: [
            { name: { contains: query.search, mode: "insensitive" } },
            { email: { contains: query.search, mode: "insensitive" } },
          ],
        },
      }),
    };
  }
}
