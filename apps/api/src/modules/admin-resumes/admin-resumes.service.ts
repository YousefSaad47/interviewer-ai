import { AbstractService } from "@/common/contracts";
import { NotFoundException } from "@/common/exceptions";
import type { PrismaClient } from "@/generated/client";

import { AdminResumesMapper } from "./admin-resumes.mapper";
import { AdminResumesRepository } from "./admin-resumes.repository";
import type { AdminResumesQuery } from "./admin-resumes.schema";

export class AdminResumesService extends AbstractService {
  private readonly repository: AdminResumesRepository;

  public constructor(prisma: PrismaClient) {
    super(prisma);
    this.repository = new AdminResumesRepository(prisma);
  }

  public async listResumes(query: AdminResumesQuery, _adminUserId: string) {
    const [resumes, total] = await Promise.all([
      this.repository.findAdminResumes(query),
      this.repository.countAdminResumes(query),
    ]);

    const totalPages = Math.ceil(total / query.limit);

    return {
      data: resumes.map(AdminResumesMapper.toListItem),
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

  public async getResumeDetails(resumeId: string, _adminUserId: string) {
    const resume = await this.repository.findAdminResumeDetailsById(resumeId);

    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    return AdminResumesMapper.toDetails(resume);
  }
}
