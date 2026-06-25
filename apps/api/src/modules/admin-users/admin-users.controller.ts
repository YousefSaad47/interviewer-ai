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
  type AdminUserStatusBody,
  type AdminUsersQuery,
  adminUserDetailsResponseSchema,
  adminUserParamsSchema,
  adminUserStatusBodySchema,
  adminUserStatusResponseSchema,
  adminUsersListResponseSchema,
  adminUsersQuerySchema,
} from "./admin-users.schema";
import { AdminUsersService } from "./admin-users.service";

const ADMIN_READ_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;
const SUPER_ADMIN_ONLY = ["SUPER_ADMIN"] as const;

export class AdminUsersController extends AbstractController<AdminUsersService> {
  public override path = "admin/users";

  protected _registerRoutes() {
    this._registerOpenAPI();

    this._router.use(authMiddleware);

    this._router.get(
      "/",
      adminRoleMiddleware(ADMIN_READ_ROLES),
      validationMiddleware({ query: adminUsersQuerySchema }),
      this._list,
    );

    this._router.get(
      "/:id",
      adminRoleMiddleware(ADMIN_READ_ROLES),
      validationMiddleware({ params: adminUserParamsSchema }),
      this._getById,
    );

    this._router.patch(
      "/:id/status",
      adminRoleMiddleware(SUPER_ADMIN_ONLY),
      validationMiddleware({
        params: adminUserParamsSchema,
        body: adminUserStatusBodySchema,
      }),
      this._changeStatus,
    );
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Admin Users"],
      method: "get",
      path: "/api/admin/users",
      summary: "List users for admin review",
      querySchema: adminUsersQuerySchema,
      responseSchema: adminUsersListResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Paginated users with identity fields and usage counts. Requires ADMIN or SUPER_ADMIN.",
    });

    registerPath({
      tags: ["Admin Users"],
      method: "get",
      path: "/api/admin/users/{id}",
      summary: "Get admin user details",
      paramsSchema: adminUserParamsSchema,
      responseSchema: adminUserDetailsResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "User details, derived last login, activity totals, and bounded recent activity. Requires ADMIN or SUPER_ADMIN.",
    });

    registerPath({
      tags: ["Admin Users"],
      method: "patch",
      path: "/api/admin/users/{id}/status",
      summary: "Change user account status",
      paramsSchema: adminUserParamsSchema,
      bodySchema: adminUserStatusBodySchema,
      responseSchema: adminUserStatusResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Updated user status. Requires SUPER_ADMIN. Disabling invalidates the target user's sessions.",
    });
  }

  private _list: RequestHandler = async (_req, res) => {
    const query = res.locals.validatedQuery as AdminUsersQuery;
    const result = await this._service.listUsers(query);
    res.ok(result);
  };

  private _getById: RequestHandler<{ id: string }> = async (req, res) => {
    const result = await this._service.getUserDetails(req.params.id);
    res.ok(result);
  };

  private _changeStatus: RequestHandler<
    { id: string },
    unknown,
    AdminUserStatusBody
  > = async (req, res) => {
    const result = await this._service.changeUserStatus(
      getAuthenticatedUserId(req),
      req.params.id,
      req.body,
    );
    res.ok(result);
  };
}
