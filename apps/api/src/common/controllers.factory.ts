/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
/** biome-ignore-all lint/complexity/noThisInStatic: <> */

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
        default:
          throw new InternalException(`Unknown controller: ${controller}`);
      }
    }

    return this._controllers.get(
      controller,
    ) as AbstractController<AbstractService>;
  }

  public static get controllers() {
    return Array.from(this._controllers.values());
  }
}
