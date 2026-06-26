/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
/** biome-ignore-all lint/complexity/noThisInStatic: <> */

import { prisma } from "@/lib/prisma";
import { AdminAnalyticsService } from "@/modules/admin-analytics";
import { AdminCodingService } from "@/modules/admin-coding";
import { AdminInterviewsService } from "@/modules/admin-interviews";
import { AdminManagementService } from "@/modules/admin-management";
import { AdminResumesService } from "@/modules/admin-resumes";
import { AdminUsersService } from "@/modules/admin-users";
import { CodingService, codingCacheService } from "@/modules/coding";
import { DashboardService } from "@/modules/dashboard";
import { InterviewService } from "@/modules/interview";
import { ProblemService } from "@/modules/problem";
import { SampleService } from "@/modules/sample";
import { hume } from "@/services/hume";
import { judge0 } from "@/services/judge0/judge0";

import { AbstractService } from "./contracts";
import { Services } from "./enums";
import { InternalException } from "./exceptions";

export class ServicesFactory {
  private static _services: Map<Services, AbstractService> = new Map();

  public static create<T extends AbstractService>(service: Services): T {
    if (!this._services.has(service)) {
      switch (service) {
        case Services.SAMPLE:
          this._services.set(service, new SampleService(prisma));
          break;
        case Services.CODING:
          this._services.set(
            service,
            new CodingService(prisma, judge0, codingCacheService),
          );
          break;

        case Services.PROBLEM:
          this._services.set(service, new ProblemService(prisma));
          break;
        case Services.INTERVIEW:
          this._services.set(service, new InterviewService(prisma, hume));
          break;
        case Services.DASHBOARD:
          this._services.set(service, new DashboardService(prisma));
          break;
        case Services.ADMIN_USERS:
          this._services.set(service, new AdminUsersService(prisma));
          break;
        case Services.ADMIN_INTERVIEWS:
          this._services.set(service, new AdminInterviewsService(prisma));
          break;
        case Services.ADMIN_CODING:
          this._services.set(service, new AdminCodingService(prisma));
          break;
        case Services.ADMIN_RESUMES:
          this._services.set(service, new AdminResumesService(prisma));
          break;
        case Services.ADMIN_ANALYTICS:
          this._services.set(service, new AdminAnalyticsService(prisma));
          break;
        case Services.ADMIN_MANAGEMENT:
          this._services.set(service, new AdminManagementService(prisma));
          break;
        default:
          throw new InternalException(
            `Unknown service: ${service satisfies never}`,
          );
      }
    }

    return this._services.get(service) as T;
  }
}
