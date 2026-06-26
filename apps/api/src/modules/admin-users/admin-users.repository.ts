import type { Prisma, PrismaClient } from "@/generated/client";
import type { UserStatus } from "@/generated/enums";

import type { AdminUsersQuery } from "./admin-users.schema";

const adminUserListSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  emailVerified: true,
  role: true,
  status: true,
  createdAt: true,
  _count: {
    select: {
      interviews: true,
      submissions: true,
      resumes: true,
    },
  },
} satisfies Prisma.UserSelect;

const adminUserDetailsBaseSelect = {
  ...adminUserListSelect,
  updatedAt: true,
} satisfies Prisma.UserSelect;

const buildAdminUserDetailsSelect = (now: Date) =>
  ({
    ...adminUserDetailsBaseSelect,
    sessions: {
      where: { expiresAt: { gt: now } },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: 1,
      select: { updatedAt: true },
    },
  }) satisfies Prisma.UserSelect;

export type AdminUserListRecord = Prisma.UserGetPayload<{
  select: typeof adminUserListSelect;
}>;

export type AdminUserDetailsRecord = AdminUserListRecord & {
  updatedAt: Date;
  sessions: { updatedAt: Date }[];
};

export type AdminUserForStatusChangeRecord = {
  id: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: UserStatus;
};

export type RecentInterviewRecord = {
  id: string;
  category: string;
  status: string;
  createdAt: Date;
};

export type RecentCodingSubmissionRecord = {
  id: string;
  status: string;
  createdAt: Date;
  problem: { title: string };
};

export type RecentResumeRecord = {
  id: string;
  title: string;
  status: string;
  createdAt: Date;
};

export class AdminUsersRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public findAdminUsers(query: AdminUsersQuery) {
    return this.prisma.user.findMany({
      where: this._buildUserWhere(query),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      select: adminUserListSelect,
    });
  }

  public countAdminUsers(query: AdminUsersQuery) {
    return this.prisma.user.count({
      where: this._buildUserWhere(query),
    });
  }

  public findAdminUserDetailsById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: buildAdminUserDetailsSelect(new Date()),
    });
  }

  public findUserForStatusChange(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true },
    });
  }

  public findRecentInterviews(userId: string, limit: number) {
    return this.prisma.interview.findMany({
      where: { userId },
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      select: {
        id: true,
        category: true,
        status: true,
        createdAt: true,
      },
    });
  }

  public findRecentCodingSubmissions(userId: string, limit: number) {
    return this.prisma.codingSubmission.findMany({
      where: { userId },
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      select: {
        id: true,
        status: true,
        createdAt: true,
        problem: { select: { title: true } },
      },
    });
  }

  public findRecentResumes(userId: string, limit: number) {
    return this.prisma.resume.findMany({
      where: { userId },
      take: limit,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
      },
    });
  }

  public updateUserStatus(userId: string, status: UserStatus) {
    if (status === "DISABLED") {
      return this.prisma.$transaction(async (tx) => {
        const user = await tx.user.update({
          where: { id: userId },
          data: { status },
          select: { id: true, status: true },
        });

        await tx.session.deleteMany({ where: { userId } });

        return user;
      });
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { status },
      select: { id: true, status: true },
    });
  }

  private _buildUserWhere(query: AdminUsersQuery): Prisma.UserWhereInput {
    return {
      ...(query.status && { status: query.status }),
      ...(query.role && { role: query.role }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: "insensitive" } },
          { email: { contains: query.search, mode: "insensitive" } },
        ],
      }),
    };
  }
}
