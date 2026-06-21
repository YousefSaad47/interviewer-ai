import type { RequestHandler } from "express";

import { AbstractController } from "@/common/contracts";
import { HttpStatus } from "@/common/enums";
import { UnauthorizedException } from "@/common/exceptions";
import { authMiddleware } from "@/middlewares";
import { registerPath } from "@/services/openapi/registry";

import {
  dashboardStatsSchema,
  goalsSchema,
  recentActivitySchema,
  skillsSchema,
} from "./dashboard.schema";
import { DashboardService } from "./dashboard.service";

export class DashboardController extends AbstractController<DashboardService> {
  public override path = "dashboard";

  protected _registerRoutes() {
    this._registerOpenAPI();
    this._router.use(authMiddleware);

    this._router.get("/stats", this._getStats);
    this._router.get("/recent", this._getRecent);
    this._router.get("/skills", this._getSkills);
    this._router.get("/goals", this._getGoals);
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Dashboard"],
      method: "get",
      path: "/api/dashboard/stats",
      summary: "Get dashboard statistics",
      responseSchema: dashboardStatsSchema,
      statusCode: HttpStatus.OK,
      responseDescription: "Dashboard stats",
    });
    registerPath({
      tags: ["Dashboard"],
      method: "get",
      path: "/api/dashboard/recent",
      summary: "Get recent activity",
      responseSchema: recentActivitySchema,
      statusCode: HttpStatus.OK,
      responseDescription: "Recent activity",
    });
    registerPath({
      tags: ["Dashboard"],
      method: "get",
      path: "/api/dashboard/skills",
      summary: "Get skills overview",
      responseSchema: skillsSchema,
      statusCode: HttpStatus.OK,
      responseDescription: "Skills overview",
    });
    registerPath({
      tags: ["Dashboard"],
      method: "get",
      path: "/api/dashboard/goals",
      summary: "Get weekly goals progress",
      responseSchema: goalsSchema,
      statusCode: HttpStatus.OK,
      responseDescription: "Weekly goals",
    });
  }

  private _getStats: RequestHandler = async (req, res) => {
    if (!req.userId) throw new UnauthorizedException();
    const result = await this._service.getStats(req.userId);
    res.ok(result);
  };

  private _getRecent: RequestHandler = async (req, res) => {
    if (!req.userId) throw new UnauthorizedException();
    const result = await this._service.getRecent(req.userId);
    res.ok(result);
  };

  private _getSkills: RequestHandler = async (req, res) => {
    if (!req.userId) throw new UnauthorizedException();
    const result = await this._service.getSkills(req.userId);
    res.ok(result);
  };

  private _getGoals: RequestHandler = async (req, res) => {
    if (!req.userId) throw new UnauthorizedException();
    const result = await this._service.getGoals(req.userId);
    res.ok(result);
  };
}
