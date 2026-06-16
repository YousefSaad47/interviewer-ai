import { once } from "node:events";

import type { Application } from "express";
import { json } from "express";

import { env } from "@/core";
import { logger } from "@/lib/logger";
import { errorHandler } from "@/middlewares";

import { HttpStatus } from "../enums";
import type { Controller } from "../types";

export const extendExpressApp = (app: Application) => {
  app.registerParsers = () => {
    app.use(json());
    return app;
  };

  app.registerControllers = (controllers: Controller[]) => {
    controllers.forEach((controller) => {
      app.use(`/api/${controller.path}`, controller.router);
    });
    return app;
  };

  app.registerErrorHandlers = () => {
    app.use((_req, res) => {
      res.status(HttpStatus.NOT_FOUND).json({ message: "Not Found" });
    });
    app.use(errorHandler);
    return app;
  };

  app.bootstrap = async () => {
    const startServer = async (port: number) => {
      const server = app.listen(port);
      await once(server, "listening");
      logger.info(`Server is running on port http://localhost:${port}`);
    };

    const port = env.PORT;

    try {
      await startServer(port);
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "EADDRINUSE"
      ) {
        logger.warn(`Port ${port} is in use. Trying port ${port + 1}...`);
        await startServer(port + 1);
      } else {
        throw error;
      }
    }
  };
};
