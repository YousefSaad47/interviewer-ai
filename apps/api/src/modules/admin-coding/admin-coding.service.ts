import { AbstractService } from "@/common/contracts";
import { NotFoundException } from "@/common/exceptions";
import type { PrismaClient } from "@/generated/client";

import { AdminCodingMapper } from "./admin-coding.mapper";
import { AdminCodingRepository } from "./admin-coding.repository";
import type { AdminCodingSubmissionsQuery } from "./admin-coding.schema";

export class AdminCodingService extends AbstractService {
  private readonly repository: AdminCodingRepository;

  public constructor(prisma: PrismaClient) {
    super(prisma);
    this.repository = new AdminCodingRepository(prisma);
  }

  public async listSubmissions(
    query: AdminCodingSubmissionsQuery,
    _adminUserId: string,
  ) {
    const [submissions, total] = await Promise.all([
      this.repository.findAdminCodingSubmissions(query),
      this.repository.countAdminCodingSubmissions(query),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: submissions.map(AdminCodingMapper.toListItem),
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

  public async getSubmissionDetails(
    submissionId: string,
    _adminUserId: string,
  ) {
    const submission =
      await this.repository.findAdminCodingSubmissionDetailsById(submissionId);

    if (!submission) {
      throw new NotFoundException("Coding submission not found");
    }

    return AdminCodingMapper.toDetails(submission);
  }
}
