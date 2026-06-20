/** biome-ignore-all lint/style/noNonNullAssertion: <> */

import type { RequestHandler } from "express";

import { AbstractController } from "@/common/contracts";
import { HttpStatus } from "@/common/enums";
import {
  authMiddleware,
  codingRateLimitMiddleware,
  validationMiddleware,
} from "@/middlewares";
import { registerPath } from "@/services/openapi/registry";

import {
  type CodingRunInput,
  type CodingSubmitInput,
  codingRunSchema,
  codingSubmitResponseSchema,
  codingSubmitSchema,
} from "./coding.schema";
import { CodingService } from "./coding.service";

export class CodingController extends AbstractController<CodingService> {
  public override path = "coding";

  protected _registerRoutes() {
    this._registerOpenAPI();

    this._router.use(authMiddleware);

    this._router.post(
      "/submissions",
      codingRateLimitMiddleware,
      validationMiddleware({ body: codingSubmitSchema }),
      this._submit,
    );

    this._router.post(
      "/run",
      codingRateLimitMiddleware,
      validationMiddleware({ body: codingRunSchema }),
      this._run,
    );

    this._router.get("/submissions", this._getSubmissions);
    this._router.get("/submissions/:id", this._getSubmission);
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Coding"],
      method: "post",
      path: "/api/coding/submissions",
      summary: "Submit code for execution",
      bodySchema: codingSubmitSchema,
      responseSchema: codingSubmitResponseSchema,
      statusCode: HttpStatus.ACCEPTED,
      responseDescription: "Submission created and execution started",
    });
  }

  private _run: RequestHandler<unknown, unknown, CodingRunInput> = async (
    req,
    res,
  ) => {
    const result = await this._service.run(req.userId!, req.body);
    res.ok(result);
  };

  private _submit: RequestHandler<unknown, unknown, CodingSubmitInput> = async (
    req,
    res,
  ) => {
    const result = await this._service.submit(req.userId!, req.body);
    res.accepted(result);
  };

  private _getSubmissions: RequestHandler = async (req, res) => {
    const result = await this._service.getSubmissions(req.userId!);
    res.ok(result);
  };

  private _getSubmission: RequestHandler<{ id: string }> = async (req, res) => {
    const result = await this._service.getSubmission(
      req.params.id,
      req.userId!,
    );
    res.ok(result);
  };
}
