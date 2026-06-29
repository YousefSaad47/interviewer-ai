import type { RequestHandler } from "express";

import { AbstractController } from "@/common/contracts";
import { BadRequestException } from "@/common/exceptions";
import {
  authMiddleware,
  getAuthenticatedUserId,
  validationMiddleware,
} from "@/middlewares";

import { resumeExportInputSchema } from "./resume-export.schema";
import type { ResumeExportService } from "./resume-export.service";

export class ResumeExportController extends AbstractController<ResumeExportService> {
  public override path = "resumes/export";

  protected _registerRoutes() {
    this._router.use(authMiddleware);

    this._router.post(
      "/",
      validationMiddleware({ body: resumeExportInputSchema }),
      this._exportFromContent,
    );

    this._router.post("/:resumeId", this._exportByResumeId);
  }

  private _exportFromContent: RequestHandler = async (req, res) => {
    getAuthenticatedUserId(req);

    const { content } = req.body;
    const result = await this._service.exportFromContent(content);

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`,
    );
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Content-Length", result.pdf.length);
    res.send(result.pdf);
  };

  private _exportByResumeId: RequestHandler = async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    // biome-ignore lint/complexity/useLiteralKeys: Express params are index-signature typed.
    const resumeId = req.params["resumeId"];
    if (typeof resumeId !== "string") {
      throw new BadRequestException("Invalid resume id", {
        code: "INVALID_RESUME_DATA",
      });
    }

    const result = await this._service.exportByResumeId(resumeId, userId);

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${result.filename}"`,
    );
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("Content-Length", result.pdf.length);
    res.send(result.pdf);
  };
}
