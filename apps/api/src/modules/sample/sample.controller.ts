import type { RequestHandler } from "express";

import { AbstractController } from "@/common/contracts";
import { HttpStatus } from "@/common/enums";
import { registerPath } from "@/lib/openapi/registry";
import { validationMiddleware } from "@/middlewares";

import { type Sample, sampleSchema } from "./sample.schema";
import { SampleService } from "./sample.service";

export class SampleController extends AbstractController<SampleService> {
  public override path = "sample";

  protected _registerRoutes() {
    this._registerOpenAPI();

    this._router.post(
      "/",
      validationMiddleware({ body: sampleSchema }),
      this._create,
    );
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Sample"],
      method: "post",
      path: "/api/sample",
      summary: "Create a new sample",
      bodySchema: sampleSchema,
      statusCode: HttpStatus.CREATED,
      responseDescription: "Sample created successfully",
    });
  }

  private _create: RequestHandler<unknown, unknown, Sample> = async (
    req,
    res,
    next,
  ) => {
    try {
      const result = await this._service.create(req.body);
      res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      next(error);
    }
  };
}
