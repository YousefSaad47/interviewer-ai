/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
/** biome-ignore-all lint/complexity/noThisInStatic: <> */

import { prisma } from "@/lib/prisma";
import { SampleService } from "@/modules/sample";

import { AbstractService } from "./contracts/abstract.service";
import { Services } from "./enums";

export class ServicesFactory {
  private static _services: Map<Services, AbstractService> = new Map();

  public static create<T extends AbstractService>(service: Services): T {
    if (!this._services.has(service)) {
      switch (service) {
        case Services.SAMPLE:
          this._services.set(service, new SampleService(prisma));
          break;
        default:
          throw new Error(`Unknown service: ${service satisfies never}`);
      }
    }

    return this._services.get(service) as T;
  }
}
