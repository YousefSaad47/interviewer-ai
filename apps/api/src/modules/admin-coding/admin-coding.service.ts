import { AbstractService } from "@/common/contracts";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@/common/exceptions";
import type { PrismaClient } from "@/generated/client";

import { AdminCodingMapper } from "./admin-coding.mapper";
import { AdminCodingRepository } from "./admin-coding.repository";
import type {
  AdminCodingCreateProblemBody,
  AdminCodingSubmissionsQuery,
} from "./admin-coding.schema";

export class AdminCodingService extends AbstractService {
  private readonly repository: AdminCodingRepository;

  public constructor(prisma: PrismaClient) {
    super(prisma);
    this.repository = new AdminCodingRepository(prisma);
  }

  public async createProblem(
    input: AdminCodingCreateProblemBody,
    _adminUserId: string,
  ) {
    const slug = this._normalizeSlug(input.slug ?? input.title);
    if (slug.length < 3) {
      throw new BadRequestException("Coding problem slug is invalid");
    }

    const existingProblem = await this.repository.findCodingProblemBySlug(slug);

    if (existingProblem) {
      throw new ConflictException("Coding problem slug already exists", {
        slug,
      });
    }

    const problem = await this.repository.createCodingProblem({
      ...input,
      slug,
    });

    return AdminCodingMapper.toCreatedProblem(problem);
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

  private _normalizeSlug(value: string) {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }
}
