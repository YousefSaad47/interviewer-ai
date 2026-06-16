/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
/** biome-ignore-all lint/complexity/noThisInStatic: <> */

import { AuthController } from "@/modules/auth";

import { AbstractController } from "./contracts/abstract.controller";
import { AbstractService } from "./contracts/abstract.service";
import { Services } from "./enums";
import { Controllers } from "./enums/controllers.enum";
import { ServicesFactory } from "./services.factory";

export class ControllersFactory {
  private static _controllers: Map<
    Controllers,
    AbstractController<AbstractService>
  > = new Map();

  public static create(controller: Controllers) {
    if (!this._controllers.has(controller)) {
      switch (controller) {
        case Controllers.AUTH:
          this._controllers.set(
            controller,
            new AuthController(ServicesFactory.create(Services.AUTH)),
          );
          break;
        default:
          throw new Error(`Unknown controller: ${controller satisfies never}`);
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
