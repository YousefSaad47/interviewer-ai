import "dotenv/config";

import chalk from "chalk";
import { z } from "zod";

import { logger } from "../lib/logger";

enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TESTING = "testing",
}

const envSchema = z
  .object({
    NODE_ENV: z.enum(NodeEnv).default(NodeEnv.DEVELOPMENT),
    PORT: z.coerce.number().default(4000),
    PG_HOST: z.string(),
    PG_PORT: z.coerce.number(),
    PG_USER: z.string(),
    PG_PASSWORD: z.string(),
    PG_DB: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_USER: z.string(),
    REDIS_PASSWORD: z.string(),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
    BETTER_AUTH_URL: z.string().default("http://localhost:3000"),
    CORS_ORIGIN: z
      .string()
      .default("http://localhost:3000,http://localhost:3001"),
    MAIL_HOST: z.string().default("localhost"),
    MAIL_PORT: z.coerce.number().default(1025),
    MAIL_FROM: z.string().default("noreply@interviewer.ai"),
    GOOGLE_CLIENT_ID: z.string().default(""),
    GOOGLE_CLIENT_SECRET: z.string().default(""),
    GITHUB_CLIENT_ID: z.string().default(""),
    GITHUB_CLIENT_SECRET: z.string().default(""),
  })
  .transform((env) => {
    const {
      PG_HOST,
      PG_PORT,
      PG_USER,
      PG_PASSWORD,
      PG_DB,
      REDIS_HOST,
      REDIS_PORT,
      REDIS_USER,
      REDIS_PASSWORD,
      CORS_ORIGIN,
      ...rest
    } = env;
    const corsOrigins = CORS_ORIGIN.split(",")
      .map((o) => o.trim())
      .filter(Boolean);

    return {
      ...rest,
      DATABASE_URL: `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB}`,
      REDIS_URL: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
      CORS_ORIGIN: corsOrigins,
    };
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(chalk.red("Failed to parse environment variables"));
  console.error(chalk.red(parsed.error.message));
  process.exit(1);
}

logger.info(
  parsed.data.NODE_ENV === NodeEnv.DEVELOPMENT
    ? `Loaded ${JSON.stringify(parsed.data, null, 2)} env vars`
    : `Loaded ${JSON.stringify(Object.keys(parsed.data), null, 2)} env vars`,
);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}

export const env = {
  ...parsed.data,
  isDevelopment: parsed.data.NODE_ENV === NodeEnv.DEVELOPMENT,
  isProduction: parsed.data.NODE_ENV === NodeEnv.PRODUCTION,
  isTesting: parsed.data.NODE_ENV === NodeEnv.TESTING,
};
