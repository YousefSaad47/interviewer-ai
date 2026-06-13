import { Router } from "express";

import { AbstractService } from "./abstract.service";

export abstract class AbstractController<TService extends AbstractService> {
  protected _router: Router;

  protected constructor(protected readonly _service: TService) {
    this._router = Router();
    setImmediate(() => this._registerRoutes());
  }

  protected abstract _registerRoutes(): void;

  public get router() {
    return this._router;
  }
}
