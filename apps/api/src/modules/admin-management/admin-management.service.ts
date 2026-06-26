import { AbstractService } from "@/common/contracts";
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@/common/exceptions";
import type { PrismaClient } from "@/generated/client";

import { AdminManagementMapper } from "./admin-management.mapper";
import type { AdminAccountMutationRecord } from "./admin-management.repository";
import { AdminManagementRepository } from "./admin-management.repository";
import type {
  AdminAccountsQuery,
  PromoteAdminBody,
  UpdateAdminBody,
} from "./admin-management.schema";

export class AdminManagementService extends AbstractService {
  private readonly repository: AdminManagementRepository;

  public constructor(prisma: PrismaClient) {
    super(prisma);
    this.repository = new AdminManagementRepository(prisma);
  }

  public async listAdmins(query: AdminAccountsQuery, _currentAdminId: string) {
    const [admins, total] = await Promise.all([
      this.repository.findAdminAccounts(query),
      this.repository.countAdminAccounts(query),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: admins.map(AdminManagementMapper.toListItem),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages,
        hasNextPage: query.page < totalPages,
        hasPreviousPage: query.page > 1,
      },
    };
  }

  public async promoteAdmin(_currentAdminId: string, input: PromoteAdminBody) {
    const target = await this.repository.findUserForPromotion(input.userId);

    if (!target) {
      throw new NotFoundException("User not found");
    }

    if (target.status !== "ACTIVE") {
      throw new ForbiddenException("Disabled users cannot be promoted");
    }

    if (target.role === "ADMIN" || target.role === "SUPER_ADMIN") {
      throw new ConflictException("User is already an admin");
    }

    const promotedAdmin = await this.repository.promoteUserToAdmin(
      input.userId,
      input,
    );

    return AdminManagementMapper.toMutationResponse(promotedAdmin);
  }

  public async updateAdmin(
    currentAdminId: string,
    adminId: string,
    input: UpdateAdminBody,
  ) {
    const updatedAdmin = await this.repository.updateAdminAccountSafely(
      adminId,
      input,
      (target, activeSuperAdmins) => {
        assertAdminTargetExists(target);
        assertSelfUpdateAllowed(currentAdminId, target, input);
        assertLastSuperAdminProtected(target, input, activeSuperAdmins);
      },
    );

    return AdminManagementMapper.toMutationResponse(updatedAdmin);
  }

  public async removeAdminAccess(currentAdminId: string, adminId: string) {
    return this.repository.removeAdminAccessSafely(
      adminId,
      (target, activeSuperAdmins) => {
        assertAdminTargetExists(target);

        if (target.id === currentAdminId) {
          throw new ForbiddenException(
            "Super admins cannot remove their own admin access",
          );
        }

        assertLastSuperAdminProtected(
          target,
          { role: "ADMIN" },
          activeSuperAdmins,
        );
      },
    );
  }
}

const assertAdminTargetExists = (target: AdminAccountMutationRecord) => {
  if (target.role !== "ADMIN" && target.role !== "SUPER_ADMIN") {
    throw new NotFoundException("Admin not found");
  }
};

const assertSelfUpdateAllowed = (
  currentAdminId: string,
  target: AdminAccountMutationRecord,
  input: UpdateAdminBody,
) => {
  if (target.id !== currentAdminId) {
    return;
  }

  if (input.status === "DISABLED") {
    throw new ForbiddenException("Super admins cannot disable themselves");
  }

  if (target.role === "SUPER_ADMIN" && input.role === "ADMIN") {
    throw new ForbiddenException("Super admins cannot demote themselves");
  }
};

const assertLastSuperAdminProtected = (
  target: AdminAccountMutationRecord,
  input: UpdateAdminBody,
  activeSuperAdmins: number,
) => {
  if (target.role !== "SUPER_ADMIN" || target.status !== "ACTIVE") {
    return;
  }

  const removesActiveSuperAdmin =
    input.status === "DISABLED" ||
    (input.role !== undefined && input.role !== "SUPER_ADMIN");

  if (removesActiveSuperAdmin && activeSuperAdmins <= 1) {
    throw new ForbiddenException("Cannot remove the last active super admin");
  }
};
