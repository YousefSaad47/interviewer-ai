import type { Prisma, PrismaClient } from "@/generated/client";

import type { AdminCodingSubmissionsQuery } from "./admin-coding.schema";

const codingScoreFieldsSelect = {
  logicScore: true,
  namingScore: true,
  efficiencyScore: true,
  bestPracticesScore: true,
} satisfies Prisma.CodingSubmissionSelect;

const codingProblemScoreWeightsSelect = {
  logicWeight: true,
  namingWeight: true,
  efficiencyWeight: true,
  bestPracticesWeight: true,
} satisfies Prisma.CodingProblemSelect;

const adminCodingSubmissionListSelect = {
  id: true,
  language: true,
  status: true,
  executionTimeMs: true,
  memoryUsedKb: true,
  createdAt: true,
  ...codingScoreFieldsSelect,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
  problem: {
    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,
      ...codingProblemScoreWeightsSelect,
    },
  },
} satisfies Prisma.CodingSubmissionSelect;

const adminCodingSubmissionDetailsSelect = {
  ...adminCodingSubmissionListSelect,
  code: true,
  aiFeedback: true,
  problem: {
    select: {
      id: true,
      title: true,
      slug: true,
      difficulty: true,
      description: true,
      constraints: true,
      ...codingProblemScoreWeightsSelect,
    },
  },
  results: {
    orderBy: [{ testCase: { sortOrder: "asc" } }, { id: "asc" }],
    select: {
      id: true,
      passed: true,
      output: true,
      error: true,
      testCase: {
        select: {
          id: true,
          isHidden: true,
          sortOrder: true,
          input: true,
          output: true,
        },
      },
    },
  },
} satisfies Prisma.CodingSubmissionSelect;

export type AdminCodingSubmissionListRecord =
  Prisma.CodingSubmissionGetPayload<{
    select: typeof adminCodingSubmissionListSelect;
  }>;

export type AdminCodingSubmissionDetailsRecord =
  Prisma.CodingSubmissionGetPayload<{
    select: typeof adminCodingSubmissionDetailsSelect;
  }>;

export class AdminCodingRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public findAdminCodingSubmissions(query: AdminCodingSubmissionsQuery) {
    return this.prisma.codingSubmission.findMany({
      where: this._buildSubmissionWhere(query),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: adminCodingSubmissionListSelect,
    });
  }

  public countAdminCodingSubmissions(query: AdminCodingSubmissionsQuery) {
    return this.prisma.codingSubmission.count({
      where: this._buildSubmissionWhere(query),
    });
  }

  public findAdminCodingSubmissionDetailsById(submissionId: string) {
    return this.prisma.codingSubmission.findUnique({
      where: { id: submissionId },
      select: adminCodingSubmissionDetailsSelect,
    });
  }

  private _buildSubmissionWhere(
    query: AdminCodingSubmissionsQuery,
  ): Prisma.CodingSubmissionWhereInput {
    return {
      ...(query.userId && { userId: query.userId }),
      ...(query.problemId && { problemId: query.problemId }),
      ...(query.status && { status: query.status }),
      ...(query.language && { language: query.language }),
      ...(query.difficulty && {
        problem: {
          difficulty: query.difficulty,
        },
      }),
      ...((query.from || query.to) && {
        createdAt: {
          ...(query.from && { gte: new Date(query.from) }),
          ...(query.to && { lte: new Date(query.to) }),
        },
      }),
      ...(query.search && {
        OR: [
          {
            user: {
              OR: [
                { name: { contains: query.search, mode: "insensitive" } },
                { email: { contains: query.search, mode: "insensitive" } },
              ],
            },
          },
          {
            problem: {
              OR: [
                { title: { contains: query.search, mode: "insensitive" } },
                { slug: { contains: query.search, mode: "insensitive" } },
              ],
            },
          },
        ],
      }),
    };
  }
}
