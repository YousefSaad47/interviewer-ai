import type { RateLimiterAbstract } from "rate-limiter-flexible";
import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible";

import { env } from "@/core/env";
import { getRedis } from "@/core/redis";

interface RateLimiterOptions {
  keyPrefix: string;
  points: number;
  duration: number;
  prodPoints?: number;
}

export const createRateLimiter = (
  options: RateLimiterOptions,
): RateLimiterAbstract => {
  if (env.isProduction) {
    return new RateLimiterRedis({
      storeClient: getRedis(),
      keyPrefix: options.keyPrefix,
      points: options.prodPoints ?? options.points,
      duration: options.duration,
    });
  }

  return new RateLimiterMemory({
    points: options.points,
    duration: options.duration,
  });
};

export const rateLimiter = createRateLimiter({
  keyPrefix: "rl",
  points: 1000,
  duration: 60,
  prodPoints: 100,
});

export const codingRateLimiter = createRateLimiter({
  keyPrefix: "rl:code",
  points: 30,
  duration: 60,
  prodPoints: 10,
});
