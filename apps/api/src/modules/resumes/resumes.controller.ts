import type { RequestHandler } from "express";

import { AbstractController } from "@/common/contracts";
import { HttpStatus } from "@/common/enums";
import {
  authMiddleware,
  getAuthenticatedUserId,
  validationMiddleware,
} from "@/middlewares";
import { registerPath } from "@/services/openapi/registry";

import {
  type ResumeSaveInput,
  resumeNullableResponseSchema,
  resumeResponseSchema,
  resumeSaveSchema,
} from "./resumes.schema";
import { ResumesService } from "./resumes.service";

export class ResumesController extends AbstractController<ResumesService> {
  public override path = "resumes";

  protected _registerRoutes() {
    this._registerOpenAPI();
    this._router.use(authMiddleware);

    this._router.get("/me", this._getMine);
    this._router.put(
      "/me",
      validationMiddleware({ body: resumeSaveSchema }),
      this._saveMine,
    );
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Resumes"],
      method: "get",
      path: "/api/resumes/me",
      summary: "Get the authenticated user's current resume",
      responseSchema: resumeNullableResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "The latest non-archived resume for the authenticated user, or null when no resume has been saved.",
    });

    registerPath({
      tags: ["Resumes"],
      method: "put",
      path: "/api/resumes/me",
      summary: "Save the authenticated user's current resume",
      bodySchema: resumeSaveSchema,
      responseSchema: resumeResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Creates or updates the latest non-archived resume for the authenticated user.",
    });
  }

  private _getMine: RequestHandler = async (req, res) => {
    const result = await this._service.getMine(getAuthenticatedUserId(req));
    res.ok(result);
  };

  private _saveMine: RequestHandler = async (req, res) => {
    const input = req.body as ResumeSaveInput;
    const result = await this._service.saveMine(
      getAuthenticatedUserId(req),
      input,
    );
    res.ok(result);
  };
}
