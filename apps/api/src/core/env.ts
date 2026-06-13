import "dotenv/config";

import chalk from "chalk";
import { z } from "zod";

enum NodeEnv {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TESTING = "testing",
}

const envSchema = z
  .object({
    NODE_ENV: z.enum(NodeEnv).default(NodeEnv.DEVELOPMENT),
    PG_HOST: z.string(),
    PG_PORT: z.coerce.number(),
    PG_USER: z.string(),
    PG_PASSWORD: z.string(),
    PG_DB: z.string(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number(),
    REDIS_USER: z.string(),
    REDIS_PASSWORD: z.string(),
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
      ...rest
    } = env;
    return {
      ...rest,
      PG_URL: `postgresql://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DB}`,
      REDIS_URL: `redis://${REDIS_USER}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`,
    };
  });

export const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(chalk.red("Failed to parse environment variables"));
  console.error(chalk.red(parsed.error.message));
  process.exit(1);
}

console.log(
  parsed.data.NODE_ENV === NodeEnv.DEVELOPMENT
    ? chalk.dim(`Loaded ${JSON.stringify(parsed.data, null, 2)} env vars`)
    : chalk.dim(
        `Loaded ${JSON.stringify(Object.keys(parsed.data), null, 2)} env vars`,
      ),
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
