import { AbstractService } from "@/common/contracts";
import { NotFoundException } from "@/common/exceptions";
import type { PrismaClient } from "@/generated/client";

import { AdminUsersMapper } from "./admin-users.mapper";
import { assertCanChangeAdminUserStatus } from "./admin-users.policy";
import { AdminUsersRepository } from "./admin-users.repository";
import {
  ADMIN_USERS_RECENT_ACTIVITY_LIMIT,
  type AdminUserStatusBody,
  type AdminUsersQuery,
} from "./admin-users.schema";

export class AdminUsersService extends AbstractService {
  private readonly repository: AdminUsersRepository;

  public constructor(prisma: PrismaClient) {
    super(prisma);
    this.repository = new AdminUsersRepository(prisma);
  }

  public async listUsers(query: AdminUsersQuery) {
    const [users, total] = await Promise.all([
      this.repository.findAdminUsers(query),
      this.repository.countAdminUsers(query),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: users.map(AdminUsersMapper.toListItem),
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

  public async getUserDetails(userId: string) {
    const [user, interviews, submissions, resumes] = await Promise.all([
      this.repository.findAdminUserDetailsById(userId),
      this.repository.findRecentInterviews(
        userId,
        ADMIN_USERS_RECENT_ACTIVITY_LIMIT,
      ),
      this.repository.findRecentCodingSubmissions(
        userId,
        ADMIN_USERS_RECENT_ACTIVITY_LIMIT,
      ),
      this.repository.findRecentResumes(
        userId,
        ADMIN_USERS_RECENT_ACTIVITY_LIMIT,
      ),
    ]);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const recentActivity = AdminUsersMapper.toRecentActivity(
      interviews,
      submissions,
      resumes,
    );

    return AdminUsersMapper.toDetails(user, recentActivity);
  }

  public async changeUserStatus(
    currentUserId: string,
    targetUserId: string,
    input: AdminUserStatusBody,
  ) {
    const targetUser =
      await this.repository.findUserForStatusChange(targetUserId);

    if (!targetUser) {
      throw new NotFoundException("User not found");
    }

    assertCanChangeAdminUserStatus(currentUserId, targetUser, input.status);

    if (targetUser.status === input.status) {
      return AdminUsersMapper.toStatusResponse(targetUser);
    }
    const updatedUser = await this.repository.updateUserStatus(
      targetUserId,
      input.status,
    );

    return AdminUsersMapper.toStatusResponse(updatedUser);
  }
}
