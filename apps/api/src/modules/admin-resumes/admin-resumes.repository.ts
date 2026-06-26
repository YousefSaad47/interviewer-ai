import type { Prisma, PrismaClient } from "@/generated/client";

import type { AdminResumesQuery } from "./admin-resumes.schema";

const adminResumeListSelect = {
  id: true,
  title: true,
  status: true,
  atsScore: true,
  grammarScore: true,
  suggestions: true,
  createdAt: true,
  updatedAt: true,
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
      matches: true,
    },
  },
} satisfies Prisma.ResumeSelect;

const adminResumeDetailsSelect = {
  ...adminResumeListSelect,
  content: true,
  matches: {
    orderBy: [{ matchPct: "desc" }, { id: "asc" }],
    select: {
      id: true,
      matchPct: true,
      matchedKeywords: true,
      missingKeywords: true,
      jobDescription: {
        select: {
          title: true,
          company: true,
        },
      },
    },
  },
} satisfies Prisma.ResumeSelect;

export type AdminResumeListRecord = Prisma.ResumeGetPayload<{
  select: typeof adminResumeListSelect;
}>;

export type AdminResumeDetailsRecord = Prisma.ResumeGetPayload<{
  select: typeof adminResumeDetailsSelect;
}>;

export class AdminResumesRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public findAdminResumes(query: AdminResumesQuery) {
    return this.prisma.resume.findMany({
      where: this._buildResumeWhere(query),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      select: adminResumeListSelect,
    });
  }

  public countAdminResumes(query: AdminResumesQuery) {
    return this.prisma.resume.count({
      where: this._buildResumeWhere(query),
    });
  }

  public findAdminResumeDetailsById(resumeId: string) {
    return this.prisma.resume.findUnique({
      where: { id: resumeId },
      select: adminResumeDetailsSelect,
    });
  }

  private _buildResumeWhere(query: AdminResumesQuery): Prisma.ResumeWhereInput {
    return {
      ...(query.userId && { userId: query.userId }),
      ...(query.status && { status: query.status }),
      ...((query.from || query.to) && {
        createdAt: {
          ...(query.from && { gte: new Date(query.from) }),
          ...(query.to && { lte: new Date(query.to) }),
        },
      }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: "insensitive" } },
          {
            user: {
              OR: [
                { name: { contains: query.search, mode: "insensitive" } },
                { email: { contains: query.search, mode: "insensitive" } },
              ],
            },
          },
        ],
      }),
    };
  }
}
