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
  type AdminResumesQuery,
  adminResumeDetailsResponseSchema,
  adminResumeParamsSchema,
  adminResumesListResponseSchema,
  adminResumesQuerySchema,
} from "./admin-resumes.schema";
import { AdminResumesService } from "./admin-resumes.service";

const ADMIN_READ_ROLES = ["ADMIN", "SUPER_ADMIN"] as const;

export class AdminResumesController extends AbstractController<AdminResumesService> {
  public override path = "admin/resumes";

  protected _registerRoutes() {
    this._registerOpenAPI();

    this._router.use(authMiddleware);

    this._router.get(
      "/",
      adminRoleMiddleware(ADMIN_READ_ROLES),
      validationMiddleware({ query: adminResumesQuerySchema }),
      this._list,
    );

    this._router.get(
      "/:id",
      adminRoleMiddleware(ADMIN_READ_ROLES),
      validationMiddleware({ params: adminResumeParamsSchema }),
      this._getById,
    );
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Admin Resumes"],
      method: "get",
      path: "/api/admin/resumes",
      summary: "List resumes for admin review",
      querySchema: adminResumesQuerySchema,
      responseSchema: adminResumesListResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Paginated resume summaries filtered by candidate, status, and inclusive createdAt date range. Full resume content, raw job descriptions, and tailored resumes are not returned. Requires ADMIN or SUPER_ADMIN.",
    });

    registerPath({
      tags: ["Admin Resumes"],
      method: "get",
      path: "/api/admin/resumes/{id}",
      summary: "Get admin resume details",
      paramsSchema: adminResumeParamsSchema,
      responseSchema: adminResumeDetailsResponseSchema,
      authType: "bearerAuth",
      statusCode: HttpStatus.OK,
      responseDescription:
        "Resume details with candidate summary, nullable scores, suggestions, safe content preview, and job match summaries. Raw resume JSON, raw job description text, and tailored resumes are omitted. Requires ADMIN or SUPER_ADMIN.",
    });
  }

  private _list: RequestHandler = async (req, res) => {
    const query = res.locals.validatedQuery as AdminResumesQuery;
    const result = await this._service.listResumes(
      query,
      getAuthenticatedUserId(req),
    );
    res.ok(result);
  };

  private _getById: RequestHandler<{ id: string }> = async (req, res) => {
    const result = await this._service.getResumeDetails(
      req.params.id,
      getAuthenticatedUserId(req),
    );
    res.ok(result);
  };
}
