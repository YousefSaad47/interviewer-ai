import { Router } from "express";

import { AbstractService } from "./abstract.service";

export abstract class AbstractController<TService extends AbstractService> {
  protected _router: Router;
  public abstract path: string;

  protected constructor(protected readonly _service: TService) {
    this._router = Router();
    setImmediate(() => this._registerRoutes());
  }

  protected abstract _registerRoutes(): void;

  public get router(): Router {
    if (this.path.includes("/")) {
      throw new Error("Path should not contain slashes");
    }

    return this._router;
  }
}
