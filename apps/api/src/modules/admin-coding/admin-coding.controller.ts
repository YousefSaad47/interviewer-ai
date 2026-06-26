import type { RequestHandler } from "express";

import { AbstractController } from "@/common/contracts";
import { HttpStatus } from "@/common/enums";
import {
  adminRoleMiddleware,
  authMiddleware,
  getAuthenticatedUserId,
  validationMiddleware,
} from "@/middlewares";
import { registerPath } from "@/services/openapi/registry";

import {
  type AdminCodingSubmissionsQuery,
  adminCodingCreateProblemBodySchema,
  adminCodingCreateProblemResponseSchema,
  adminCodingSubmissionDetailsResponseSchema,
  adminCodingSubmissionParamsSchema,
  adminCodingSubmissionsListResponseSchema,
  adminCodingSubmissionsQuerySchema,
} from "./admin-coding.schema";
import { AdminCodingService } from "./admin-coding.service";

const ADMIN_READ_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;

export class AdminCodingController extends AbstractController<AdminCodingService> {
  public override path = "admin/coding";

  protected _registerRoutes() {
    this._registerOpenAPI();

    this._router.use(authMiddleware);

    this._router.post(
      "/problems",
      adminRoleMiddleware(ADMIN_READ_ROLES),
      validationMiddleware({ body: adminCodingCreateProblemBodySchema }),
      this._createProblem,
    );

    this._router.get(
      "/submissions",
      adminRoleMiddleware(ADMIN_READ_ROLES),
      validationMiddleware({ query: adminCodingSubmissionsQuerySchema }),
      this._listSubmissions,
    );

    this._router.get(
      "/submissions/:id",
      adminRoleMiddleware(ADMIN_READ_ROLES),
      validationMiddleware({ params: adminCodingSubmissionParamsSchema }),
      this._getSubmissionById,
    );
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Admin Coding"],
      method: "post",
      path: "/api/admin/coding/problems",
      summary: "Create a coding problem",
      bodySchema: adminCodingCreateProblemBodySchema,
      responseSchema: adminCodingCreateProblemResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.CREATED,
      responseDescription:
        "Creates a coding problem and its test cases atomically. Requires ADMIN or SUPER_ADMIN.",
    });

    registerPath({
      tags: ["Admin Coding"],
      method: "get",
      path: "/api/admin/coding/submissions",
      summary: "List coding submissions for admin review",
      querySchema: adminCodingSubmissionsQuerySchema,
      responseSchema: adminCodingSubmissionsListResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Paginated coding submissions filtered by user, problem, status, language, difficulty, and inclusive createdAt date range. Source code, test cases, and judge tokens are not returned. Requires ADMIN or SUPER_ADMIN.",
    });

    registerPath({
      tags: ["Admin Coding"],
      method: "get",
      path: "/api/admin/coding/submissions/{id}",
      summary: "Get admin coding submission details",
      paramsSchema: adminCodingSubmissionParamsSchema,
      responseSchema: adminCodingSubmissionDetailsResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Coding submission details with source code, weighted nullable scores, AI feedback, and result metadata. Hidden test case input and expected output are omitted by default. Requires ADMIN or SUPER_ADMIN.",
    });
  }

  private _createProblem: RequestHandler = async (req, res) => {
    const result = await this._service.createProblem(
      req.body,
      getAuthenticatedUserId(req),
    );
    res.created(result);
  };

  private _listSubmissions: RequestHandler = async (req, res) => {
    const query = res.locals.validatedQuery as AdminCodingSubmissionsQuery;
    const result = await this._service.listSubmissions(
      query,
      getAuthenticatedUserId(req),
    );
    res.ok(result);
  };

  private _getSubmissionById: RequestHandler<{ id: string }> = async (
    req,
    res,
  ) => {
    const result = await this._service.getSubmissionDetails(
      req.params.id,
      getAuthenticatedUserId(req),
    );
    res.ok(result);
  };
}
