/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
/** biome-ignore-all lint/complexity/noThisInStatic: <> */

import { AdminAnalyticsController } from "@/modules/admin-analytics";
import { AdminCodingController } from "@/modules/admin-coding";
import { AdminInterviewsController } from "@/modules/admin-interviews";
import { AdminManagementController } from "@/modules/admin-management";
import { AdminResumesController } from "@/modules/admin-resumes";
import { AdminUsersController } from "@/modules/admin-users";
import { CodingController } from "@/modules/coding";
import { DashboardController } from "@/modules/dashboard";
import { InterviewController } from "@/modules/interview";
import { ProblemController } from "@/modules/problem";
import { SampleController } from "@/modules/sample";

import { AbstractController, AbstractService } from "./contracts";
import { Controllers, Services } from "./enums";
import { InternalException } from "./exceptions";
import { ServicesFactory } from "./services.factory";

export class ControllersFactory {
  private static _controllers: Map<
    Controllers,
    AbstractController<AbstractService>
  > = new Map();

  public static create(controller: Controllers) {
    if (!this._controllers.has(controller)) {
      switch (controller) {
        case Controllers.SAMPLE:
          this._controllers.set(
            controller,
            new SampleController(ServicesFactory.create(Services.SAMPLE)),
          );
          break;
        case Controllers.CODING:
          this._controllers.set(
            controller,
            new CodingController(ServicesFactory.create(Services.CODING)),
          );
          break;
        case Controllers.PROBLEM:
          this._controllers.set(
            controller,
            new ProblemController(ServicesFactory.create(Services.PROBLEM)),
          );
          break;
        case Controllers.INTERVIEW:
          this._controllers.set(
            controller,
            new InterviewController(ServicesFactory.create(Services.INTERVIEW)),
          );
          break;
        case Controllers.DASHBOARD:
          this._controllers.set(
            controller,
            new DashboardController(ServicesFactory.create(Services.DASHBOARD)),
          );
          break;
        case Controllers.ADMIN_USERS:
          this._controllers.set(
            controller,
            new AdminUsersController(
              ServicesFactory.create(Services.ADMIN_USERS),
            ),
          );
          break;
        case Controllers.ADMIN_INTERVIEWS:
          this._controllers.set(
            controller,
            new AdminInterviewsController(
              ServicesFactory.create(Services.ADMIN_INTERVIEWS),
            ),
          );
          break;
        case Controllers.ADMIN_CODING:
          this._controllers.set(
            controller,
            new AdminCodingController(
              ServicesFactory.create(Services.ADMIN_CODING),
            ),
          );
          break;
        case Controllers.ADMIN_RESUMES:
          this._controllers.set(
            controller,
            new AdminResumesController(
              ServicesFactory.create(Services.ADMIN_RESUMES),
            ),
          );
          break;
        case Controllers.ADMIN_ANALYTICS:
          this._controllers.set(
            controller,
            new AdminAnalyticsController(
              ServicesFactory.create(Services.ADMIN_ANALYTICS),
            ),
          );
          break;
        case Controllers.ADMIN_MANAGEMENT:
          this._controllers.set(
            controller,
            new AdminManagementController(
              ServicesFactory.create(Services.ADMIN_MANAGEMENT),
            ),
          );
          break;
        default:
          throw new InternalException(
            `Unknown controller: ${controller satisfies never}`,
          );
      }
    }

    return this._controllers.get(
      controller,
    ) as AbstractController<AbstractService>;
  }

  public static get controllers() {
    this.create(Controllers.SAMPLE);
    this.create(Controllers.CODING);
    this.create(Controllers.PROBLEM);
    this.create(Controllers.INTERVIEW);
    this.create(Controllers.DASHBOARD);
    this.create(Controllers.ADMIN_USERS);
    this.create(Controllers.ADMIN_INTERVIEWS);
    this.create(Controllers.ADMIN_CODING);
    this.create(Controllers.ADMIN_RESUMES);
    this.create(Controllers.ADMIN_ANALYTICS);
    this.create(Controllers.ADMIN_MANAGEMENT);

    return Array.from(this._controllers.values());
  }
}
