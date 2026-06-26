import type { Prisma, PrismaClient } from "@/generated/client";
import { Prisma as PrismaNamespace } from "@/generated/client";
import type { UserRole, UserStatus } from "@/generated/enums";

import type {
  AdminAccountsQuery,
  PromoteAdminBody,
  UpdateAdminBody,
} from "./admin-management.schema";

const adminAccountListSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  emailVerified: true,
  role: true,
  status: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

const buildAdminAccountListSelect = (now: Date) =>
  ({
    ...adminAccountListSelect,
    sessions: {
      where: { expiresAt: { gt: now } },
      orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
      take: 1,
      select: { updatedAt: true },
    },
  }) satisfies Prisma.UserSelect;

const adminAccountMutationSelect = {
  id: true,
  role: true,
  status: true,
} satisfies Prisma.UserSelect;

export type AdminAccountListRecord = Prisma.UserGetPayload<{
  select: ReturnType<typeof buildAdminAccountListSelect>;
}>;

export type AdminAccountMutationRecord = {
  id: string;
  role: UserRole;
  status: UserStatus;
};

type TransactionClient = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export class AdminManagementRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public findAdminAccounts(query: AdminAccountsQuery) {
    return this.prisma.user.findMany({
      where: this._buildAdminWhere(query),
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      select: buildAdminAccountListSelect(new Date()),
    });
  }

  public countAdminAccounts(query: AdminAccountsQuery) {
    return this.prisma.user.count({
      where: this._buildAdminWhere(query),
    });
  }

  public findUserForPromotion(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: adminAccountMutationSelect,
    });
  }

  public promoteUserToAdmin(userId: string, input: PromoteAdminBody) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role: input.role },
      select: adminAccountMutationSelect,
    });
  }

  public updateAdminAccountSafely(
    adminId: string,
    input: UpdateAdminBody,
    validate: (
      target: AdminAccountMutationRecord,
      activeSuperAdmins: number,
    ) => void,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const target = await this._findAdminAccountForMutation(tx, adminId);
        const activeSuperAdmins = await this._countActiveSuperAdmins(tx);

        validate(target, activeSuperAdmins);

        const updatedAdmin = await tx.user.update({
          where: { id: adminId },
          data: buildUpdateData(input),
          select: adminAccountMutationSelect,
        });

        if (input.status === "DISABLED") {
          await tx.session.deleteMany({ where: { userId: adminId } });
        }

        return updatedAdmin;
      },
      {
        isolationLevel: PrismaNamespace.TransactionIsolationLevel.Serializable,
      },
    );
  }

  public removeAdminAccessSafely(
    adminId: string,
    validate: (
      target: AdminAccountMutationRecord,
      activeSuperAdmins: number,
    ) => void,
  ) {
    return this.prisma.$transaction(
      async (tx) => {
        const target = await this._findAdminAccountForMutation(tx, adminId);
        const activeSuperAdmins = await this._countActiveSuperAdmins(tx);

        validate(target, activeSuperAdmins);

        await tx.user.update({
          where: { id: adminId },
          data: { role: "USER" },
          select: { id: true },
        });

        await tx.session.deleteMany({ where: { userId: adminId } });

        return { success: true as const };
      },
      {
        isolationLevel: PrismaNamespace.TransactionIsolationLevel.Serializable,
      },
    );
  }

  private async _findAdminAccountForMutation(
    tx: TransactionClient,
    adminId: string,
  ): Promise<AdminAccountMutationRecord> {
    const target = await tx.user.findUnique({
      where: { id: adminId },
      select: adminAccountMutationSelect,
    });

    if (!target) {
      return { id: adminId, role: "USER", status: "DISABLED" };
    }

    return target;
  }

  private _countActiveSuperAdmins(tx: TransactionClient) {
    return tx.user.count({
      where: { role: "SUPER_ADMIN", status: "ACTIVE" },
    });
  }

  private _buildAdminWhere(query: AdminAccountsQuery): Prisma.UserWhereInput {
    return {
      role: query.role ?? { in: ["ADMIN", "SUPER_ADMIN"] },
      ...(query.status && { status: query.status }),
      ...(query.search && {
        OR: [
          { name: { contains: query.search, mode: "insensitive" } },
          { email: { contains: query.search, mode: "insensitive" } },
        ],
      }),
    };
  }
}

const buildUpdateData = (input: UpdateAdminBody): Prisma.UserUpdateInput => ({
  ...(input.role && { role: input.role }),
  ...(input.status && { status: input.status }),
});
