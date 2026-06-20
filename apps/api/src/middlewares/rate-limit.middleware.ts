import type { NextFunction, Request, Response } from "express";
import type { RateLimiterAbstract } from "rate-limiter-flexible";
import { RateLimiterRes } from "rate-limiter-flexible";

import { rateLimiter } from "@/services/rate-limiter";

export const createRateLimitMiddleware = (
  limiter: RateLimiterAbstract,
  message = "Too many requests",
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.userId ?? req.ip ?? "anonymous";

    try {
      await limiter.consume(key);
      next();
    } catch (err) {
      if (err instanceof RateLimiterRes) {
        const retryAfter = Math.ceil(err.msBeforeNext / 1000);
        res.set("Retry-After", String(retryAfter));
        res.status(429).json({ message, retryAfter });
        return;
      }
      throw err;
    }
  };
};

export const rateLimitMiddleware = createRateLimitMiddleware(rateLimiter);
