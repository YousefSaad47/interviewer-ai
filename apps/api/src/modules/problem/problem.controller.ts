import type { RequestHandler } from "express";

import { AbstractController } from "@/common/contracts";
import { HttpStatus } from "@/common/enums";
import { registerPath } from "@/services/openapi/registry";

import {
  problemDetailResponseSchema,
  problemListResponseSchema,
  problemParamsSchema,
  problemQuerySchema,
} from "./problem.schema";
import { ProblemService } from "./problem.service";

export class ProblemController extends AbstractController<ProblemService> {
  public override path = "problems";

  protected _registerRoutes() {
    this._registerOpenAPI();

    this._router.get("/", this._list);
    this._router.get("/:slug", this._getBySlug);
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Problems"],
      method: "get",
      path: "/api/problems",
      summary: "List coding problems (paginated)",
      querySchema: problemQuerySchema,
      responseSchema: problemListResponseSchema,
      statusCode: HttpStatus.OK,
      responseDescription: "Paginated list of problems",
    });

    registerPath({
      tags: ["Problems"],
      method: "get",
      path: "/api/problems/{slug}",
      summary: "Get a single coding problem by slug",
      paramsSchema: problemParamsSchema,
      responseSchema: problemDetailResponseSchema,
      statusCode: HttpStatus.OK,
      responseDescription: "Problem details",
    });
  }

  private _list: RequestHandler = async (req, res) => {
    const query = problemQuerySchema.parse(req.query);
    const result = await this._service.list(query);
    res.ok(result);
  };

  private _getBySlug: RequestHandler<{ slug: string }> = async (req, res) => {
    const result = await this._service.getBySlug(req.params.slug);
    res.ok(result);
  };
}
