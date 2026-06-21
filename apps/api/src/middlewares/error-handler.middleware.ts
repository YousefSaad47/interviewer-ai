import type { ErrorRequestHandler } from "express";

import { HttpStatus } from "@/common/enums";
import { AbstractException } from "@/common/exceptions";
import { env } from "@/core";
import { logger } from "@/lib/logger";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AbstractException) {
    return res.status(err.statusCode).json(err.serialize());
  }

  logger.error({ err }, "Unhandled error");
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
