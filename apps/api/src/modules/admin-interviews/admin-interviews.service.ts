import { AbstractService } from "@/common/contracts";
import { NotFoundException } from "@/common/exceptions";
import type { PrismaClient } from "@/generated/client";

import { AdminInterviewsMapper } from "./admin-interviews.mapper";
import { AdminInterviewsRepository } from "./admin-interviews.repository";
import type { AdminInterviewsQuery } from "./admin-interviews.schema";

export class AdminInterviewsService extends AbstractService {
  private readonly repository: AdminInterviewsRepository;

  public constructor(prisma: PrismaClient) {
    super(prisma);
    this.repository = new AdminInterviewsRepository(prisma);
  }

  public async listInterviews(
    query: AdminInterviewsQuery,
    _adminUserId: string,
  ) {
    const [interviews, total] = await Promise.all([
      this.repository.findAdminInterviews(query),
      this.repository.countAdminInterviews(query),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: interviews.map(AdminInterviewsMapper.toListItem),
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

  public async getInterviewDetails(interviewId: string, _adminUserId: string) {
    const interview =
      await this.repository.findAdminInterviewDetailsById(interviewId);

    if (!interview) {
      throw new NotFoundException("Interview not found");
    }

    return AdminInterviewsMapper.toDetails(interview);
  }
}
