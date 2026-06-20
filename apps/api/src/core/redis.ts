import Redis from "ioredis";

import { env } from "@/core/env";
import { logger } from "@/lib/logger";

let _redis: Redis | null = null;

export const getRedis = (): Redis => {
  if (!_redis) {
    _redis = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
    });

    _redis.on("error", (err) => {
      logger.error({ err }, "Redis connection error");
    });

    _redis.on("connect", () => {
      logger.info("Redis connected");
    });
  }
  return _redis;
};
