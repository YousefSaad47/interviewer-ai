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
  type AdminAccountsQuery,
  adminAccountMutationResponseSchema,
  adminAccountParamsSchema,
  adminAccountsListResponseSchema,
  adminAccountsQuerySchema,
  type PromoteAdminBody,
  promoteAdminBodySchema,
  removeAdminAccessResponseSchema,
  type UpdateAdminBody,
  updateAdminBodySchema,
} from "./admin-management.schema";
import { AdminManagementService } from "./admin-management.service";

const SUPER_ADMIN_ONLY = ["SUPER_ADMIN"] as const;

export class AdminManagementController extends AbstractController<AdminManagementService> {
  public override path = "admin/admins";

  protected _registerRoutes() {
    this._registerOpenAPI();

    this._router.use(authMiddleware);
    this._router.use(adminRoleMiddleware(SUPER_ADMIN_ONLY));

    this._router.get(
      "/",
      validationMiddleware({ query: adminAccountsQuerySchema }),
      this._list,
    );

    this._router.post(
      "/",
      validationMiddleware({ body: promoteAdminBodySchema }),
      this._promote,
    );

    this._router.patch(
      "/:id",
      validationMiddleware({
        params: adminAccountParamsSchema,
        body: updateAdminBodySchema,
      }),
      this._update,
    );

    this._router.delete(
      "/:id",
      validationMiddleware({ params: adminAccountParamsSchema }),
      this._remove,
    );
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Admin Management"],
      method: "get",
      path: "/api/admin/admins",
      summary: "List admin accounts",
      querySchema: adminAccountsQuerySchema,
      responseSchema: adminAccountsListResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Paginated admin accounts with safe identity fields and derived last login. Requires SUPER_ADMIN.",
    });

    registerPath({
      tags: ["Admin Management"],
      method: "post",
      path: "/api/admin/admins",
      summary: "Promote an existing active user to an admin role",
      bodySchema: promoteAdminBodySchema,
      responseSchema: adminAccountMutationResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Updated role and status for the promoted user. Requires SUPER_ADMIN.",
    });

    registerPath({
      tags: ["Admin Management"],
      method: "patch",
      path: "/api/admin/admins/{id}",
      summary: "Update admin role or status",
      paramsSchema: adminAccountParamsSchema,
      bodySchema: updateAdminBodySchema,
      responseSchema: adminAccountMutationResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Updated admin role and status. Self-disable, self-demotion, and removing the last active super admin are blocked. Requires SUPER_ADMIN.",
    });

    registerPath({
      tags: ["Admin Management"],
      method: "delete",
      path: "/api/admin/admins/{id}",
      summary: "Remove admin access without deleting the user",
      paramsSchema: adminAccountParamsSchema,
      responseSchema: removeAdminAccessResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Admin access removed by setting role to USER. Self-removal and removing the last active super admin are blocked. Requires SUPER_ADMIN.",
    });
  }

  private _list: RequestHandler = async (req, res) => {
    const query = res.locals.validatedQuery as AdminAccountsQuery;
    const result = await this._service.listAdmins(
      query,
      getAuthenticatedUserId(req),
    );
    res.ok(result);
  };

  private _promote: RequestHandler<unknown, unknown, PromoteAdminBody> = async (
    req,
    res,
  ) => {
    const result = await this._service.promoteAdmin(
      getAuthenticatedUserId(req),
      req.body,
    );
    res.ok(result);
  };

  private _update: RequestHandler<{ id: string }, unknown, UpdateAdminBody> =
    async (req, res) => {
      const result = await this._service.updateAdmin(
        getAuthenticatedUserId(req),
        req.params.id,
        req.body,
      );
      res.ok(result);
    };

  private _remove: RequestHandler<{ id: string }> = async (req, res) => {
    const result = await this._service.removeAdminAccess(
      getAuthenticatedUserId(req),
      req.params.id,
    );
    res.ok(result);
  };
}
