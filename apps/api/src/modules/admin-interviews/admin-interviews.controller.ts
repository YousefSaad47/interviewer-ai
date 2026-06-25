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
  type AdminInterviewsQuery,
  adminInterviewDetailsResponseSchema,
  adminInterviewParamsSchema,
  adminInterviewsListResponseSchema,
  adminInterviewsQuerySchema,
} from "./admin-interviews.schema";
import { AdminInterviewsService } from "./admin-interviews.service";

const ADMIN_READ_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;

export class AdminInterviewsController extends AbstractController<AdminInterviewsService> {
  public override path = "admin/interviews";

  protected _registerRoutes() {
    this._registerOpenAPI();

    this._router.use(authMiddleware);

    this._router.get(
      "/",
      adminRoleMiddleware(ADMIN_READ_ROLES),
      validationMiddleware({ query: adminInterviewsQuerySchema }),
      this._list,
    );

    this._router.get(
      "/:id",
      adminRoleMiddleware(ADMIN_READ_ROLES),
      validationMiddleware({ params: adminInterviewParamsSchema }),
      this._getById,
    );
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Admin Interviews"],
      method: "get",
      path: "/api/admin/interviews",
      summary: "List interview sessions for admin review",
      querySchema: adminInterviewsQuerySchema,
      responseSchema: adminInterviewsListResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Paginated interview sessions filtered by candidate, status, category, difficulty, and inclusive startedAt date range. Requires ADMIN or SUPER_ADMIN.",
    });

    registerPath({
      tags: ["Admin Interviews"],
      method: "get",
      path: "/api/admin/interviews/{id}",
      summary: "Get admin interview details",
      paramsSchema: adminInterviewParamsSchema,
      responseSchema: adminInterviewDetailsResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Interview details with ordered questions, answers, feedback, duration, and nullable calculated scores. Requires ADMIN or SUPER_ADMIN.",
    });
  }

  private _list: RequestHandler = async (req, res) => {
    const query = res.locals.validatedQuery as AdminInterviewsQuery;
    const result = await this._service.listInterviews(
      query,
      getAuthenticatedUserId(req),
    );
    res.ok(result);
  };

  private _getById: RequestHandler<{ id: string }> = async (req, res) => {
    const result = await this._service.getInterviewDetails(
      req.params.id,
      getAuthenticatedUserId(req),
    );
    res.ok(result);
  };
}
