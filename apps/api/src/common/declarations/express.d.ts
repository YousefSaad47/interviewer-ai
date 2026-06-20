import "express";
import type { Controller } from "../types";

declare global {
  namespace Express {
    clear;
    interface Application {
      registerCors: () => this;
      registerParsers: () => this;
      registerControllers: (controllers: Controller[]) => this;
      registerErrorHandlers: () => this;
      registerOpenAPI: () => this;
      registerBullBoard: () => Promise<this>;
      bootstrap: () => Promise<void>;
    }

    interface Request {
      userId?: string;
    }

    interface Response {
      ok: (data?: unknown) => this;
      created: (data?: unknown) => this;
      accepted: (data?: unknown) => this;
      noContent: () => void;
    }
  }
}
