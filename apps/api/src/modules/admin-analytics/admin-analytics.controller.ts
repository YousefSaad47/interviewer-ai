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
  type AdminAnalyticsQuery,
  adminAnalyticsQuerySchema,
  adminAnalyticsResponseSchema,
} from "./admin-analytics.schema";
import { AdminAnalyticsService } from "./admin-analytics.service";

const ADMIN_READ_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;

export class AdminAnalyticsController extends AbstractController<AdminAnalyticsService> {
  public override path = "admin/analytics";

  protected _registerRoutes() {
    this._registerOpenAPI();

    this._router.use(authMiddleware);

    this._router.get(
      "/",
      adminRoleMiddleware(ADMIN_READ_ROLES),
      validationMiddleware({ query: adminAnalyticsQuerySchema }),
      this._getAnalytics,
    );
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Admin Analytics"],
      method: "get",
      path: "/api/admin/analytics",
      summary: "Get aggregate admin analytics",
      querySchema: adminAnalyticsQuerySchema,
      responseSchema: adminAnalyticsResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Aggregate analytics for users, interviews, coding submissions, and resumes. Supports 7d, 30d, and 90d ranges with day or week UTC buckets. Requires ADMIN or SUPER_ADMIN.",
    });
  }

  private _getAnalytics: RequestHandler = async (req, res) => {
    const query = res.locals.validatedQuery as AdminAnalyticsQuery;
    const result = await this._service.getAnalytics(
      query,
      getAuthenticatedUserId(req),
    );
    res.ok(result);
  };
}
