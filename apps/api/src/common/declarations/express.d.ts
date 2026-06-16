import "express";
import type { Controller } from "../types";

declare global {
  namespace Express {
    interface Application {
      registerParsers: () => this;
      registerControllers: (controllers: Controller[]) => this;
      registerErrorHandlers: () => this;
      registerOpenAPI: () => this;
      bootstrap: () => Promise<void>;
    }
  }
}
