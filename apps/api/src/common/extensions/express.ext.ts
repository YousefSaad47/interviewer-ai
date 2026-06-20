import { once } from "node:events";

import cors from "cors";
import type { Application, Request, Response } from "express";
import { json } from "express";
import swaggerUi from "swagger-ui-express";

import { env } from "@/core";
import { logger } from "@/lib/logger";
import { errorHandler } from "@/middlewares";
import { createOpenAPIDocument } from "@/services/openapi/registry";

import { HttpStatus } from "../enums";
import type { Controller } from "../types";
import { extendResponse } from "./res.ext";

export const extendExpressApp = (app: Application) => {
  extendResponse();
  app.registerCors = () => {
    app.use(
      cors({
        origin: env.CORS_ORIGIN,
        credentials: true,
      }),
    );
    return app;
  };

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

  app.registerOpenAPI = () => {
    app.get("/api/openapi.json", (_req: Request, res: Response) => {
      const docs = createOpenAPIDocument();
      res.json(docs);
    });
    app.use(
      "/api/docs",
      swaggerUi.serve,
      swaggerUi.setup(null, {
        swaggerUrl: "/api/openapi.json",
      }),
    );
    return app;
  };

  app.registerBullBoard = async () => {
    if (env.isDevelopment) {
      const { serverAdapter } = await import("@/services/bullmq/ui");
      app.use("/api/admin/queues", serverAdapter.getRouter());
      logger.info(
        "Bull Board mounted at http://localhost:4000/api/admin/queues",
      );
    }
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
