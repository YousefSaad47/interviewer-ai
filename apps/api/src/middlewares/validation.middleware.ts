import type { RequestHandler, Response } from "express";
import { ZodError, ZodType, z } from "zod";

import { ValidationException } from "@/common/exceptions";

declare global {
  namespace Express {
    interface Locals {
      validatedQuery: unknown;
    }
  }
}

type ValidationSchema = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export const validationMiddleware =
  (schema: ValidationSchema): RequestHandler =>
  async (req, res: Response, next) => {
    try {
      const parsed = z.object(schema).parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) {
        req.body = parsed.body;
      }

      if (parsed.params) {
        Object.assign(req.params, parsed.params);
      }

      if (parsed.query) {
        res.locals.validatedQuery = parsed.query;
      }
    } catch (error) {
      if (error instanceof ZodError) {
        throw new ValidationException("Validation failed", {
          details: z.treeifyError(error),
        });
      }
      throw error;
    }

    next();
  };
