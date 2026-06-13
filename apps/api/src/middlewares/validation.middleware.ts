import type { RequestHandler } from "express";
import { ZodError, ZodType, z } from "zod";

import { ValidationException } from "@/common/exceptions";

type ValidationSchema = {
  body?: ZodType;
  query?: ZodType;
  params?: ZodType;
};

export const validationMiddleware =
  (schema: ValidationSchema): RequestHandler =>
  async (req, _, next) => {
    try {
      const { body, query, params } = z.object(schema).parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (body) {
        req.body = body;
      }

      if (query) {
        Object.assign(req.query, query);
      }

      if (params) {
        // biome-ignore lint/suspicious/noExplicitAny: <>
        req.params = params as any;
      }
    } catch (err) {
      throw new ValidationException("Validation failed", {
        details: z.treeifyError(err as ZodError),
      });
    }

    next();
  };
