import { Router } from "express";

import { InternalException } from "@/common/exceptions";

import { AbstractService } from "./abstract.service";

export abstract class AbstractController<TService extends AbstractService> {
  protected _router: Router;
  public abstract path: string;

  public constructor(protected readonly _service: TService) {
    this._router = Router();
    setImmediate(() => this._registerRoutes());
  }

  protected abstract _registerRoutes(): void;

  public get router(): Router {
    if (this.path.includes("/")) {
      throw new InternalException("Path should not contain slashes");
    }

    return this._router;
  }
}
