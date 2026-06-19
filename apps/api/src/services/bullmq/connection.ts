import { env } from "@/core/env";

export const connection = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: null,
};
