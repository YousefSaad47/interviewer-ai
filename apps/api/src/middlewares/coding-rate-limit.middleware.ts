import { codingRateLimiter } from "@/services/rate-limiter";

import { createRateLimitMiddleware } from "./rate-limit.middleware";

export const codingRateLimitMiddleware = createRateLimitMiddleware(
  codingRateLimiter,
  "Too many code submissions. Please wait.",
);
