import { AbstractService } from "@/common/contracts";
import {
  ForbiddenException,
  InternalException,
  NotFoundException,
} from "@/common/exceptions";
import type { PrismaClient } from "@/generated/client";
import { logger } from "@/lib/logger";

import { LatexRendererService } from "./latex-renderer.service";
import { PdfCompilerService } from "./pdf-compiler.service";
import type { ResumeContent } from "./resume-export.types";
import { ResumeOptimizerService } from "./resume-optimizer.service";
import {
  mergeOptimizedResume,
  type NormalizedResumeData,
  normalizeResumeForExport,
} from "./utils/normalize-resume";
import { safeFilename } from "./utils/safe-filename";

export interface ExportResult {
  pdf: Buffer;
  filename: string;
}

export class ResumeExportService extends AbstractService {
  private readonly _optimizer: ResumeOptimizerService;
  private readonly _renderer: LatexRendererService;
  private readonly _compiler: PdfCompilerService;

  constructor(
    prisma: PrismaClient,
    optimizer: ResumeOptimizerService,
    renderer: LatexRendererService,
    compiler: PdfCompilerService,
  ) {
    super(prisma);
    this._optimizer = optimizer;
    this._renderer = renderer;
    this._compiler = compiler;
  }

  async exportFromContent(content: ResumeContent): Promise<ExportResult> {
    const normalized = normalizeResumeForExport(content);
    return this._generatePdf(normalized);
  }

  async exportByResumeId(
    resumeId: string,
    userId: string,
  ): Promise<ExportResult> {
    const resume = await this.prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    if (resume.userId !== userId) {
      throw new ForbiddenException("You do not have access to this resume.", {
        code: "FORBIDDEN_RESUME_ACCESS",
      });
    }

    const content = resume.content as unknown as ResumeContent;
    const normalized = normalizeResumeForExport(content);
    return this._generatePdf(normalized);
  }

  private async _generatePdf(
    normalized: NormalizedResumeData,
  ): Promise<ExportResult> {
    const optimized = await this._optimizer.optimize(normalized);
    const finalResume = mergeOptimizedResume(normalized, optimized);
    logger.info("Resume optimized via Gemini");

    const latex = this._renderer.render(finalResume);

    try {
      const pdf = await this._compiler.compile(latex);
      const filename = safeFilename(finalResume.personalInfo.fullName);
      return { pdf, filename };
    } catch (error) {
      if (error instanceof InternalException) throw error;
      throw new InternalException("The resume PDF could not be generated.", {
        code: "RESUME_EXPORT_FAILED",
      });
    }
  }
}
