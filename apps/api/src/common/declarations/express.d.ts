import "express";
import type { Controller } from "../types";

declare global {
  namespace Express {
    interface Application {
      registerCors: () => this;
      registerParsers: () => this;
      registerControllers: (controllers: Controller[]) => this;
      registerErrorHandlers: () => this;
      registerOpenAPI: () => this;
      registerBullBoard: () => Promise<this>;
      bootstrap: () => Promise<void>;
    }
  }
}
