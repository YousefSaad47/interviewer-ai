import chalk from "chalk";
import dotenv from "dotenv";

if (
  process.env.NODE_ENV !== "production" &&
  // biome-ignore lint/complexity/useLiteralKeys: bracket notation required for tsconfig index signatures
  !process.env["RAILWAY_ENVIRONMENT"]
) {
  dotenv.config();
}

export const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(
      `Environment variable ${key} is not set and no default value provided.`,
    );
  }
  return value;
};

export const getEnvVarAsNumber = (
  key: string,
  defaultValue?: number,
): number => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return defaultValue;
  } else {
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue)) {
      throw new Error(`Environment variable ${key} is not a number`);
    }
    return parsedValue;
  }
};

export const getEnvVarAsBoolean = (
  key: string,
  defaultValue?: boolean,
): boolean => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return defaultValue;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  throw new Error(`Environment variable ${key} must be "true" or "false"`);
};

const hasInsecureSecretPattern = (value: string): boolean => {
  const normalized = value.toLowerCase();
  return (
    normalized.includes("change-in-production") ||
    normalized.includes("your-super-secret") ||
    normalized.includes("default-encryption-key")
  );
};

const ensureMinLength = (
  key: string,
  value: string,
  minLength: number,
): string => {
  if (value.length < minLength) {
    throw new Error(
      `Environment variable ${key} must be at least ${minLength} characters.`,
    );
  }

  if (hasInsecureSecretPattern(value)) {
    throw new Error(
      `Environment variable ${key} contains an insecure placeholder value.`,
    );
  }

  return value;
};

export const ensureHexLength = (
  key: string,
  value: string,
  expectedHexLength: number,
): string => {
  const normalized = value.trim();
  const hexPattern = /^[0-9a-fA-F]+$/;

  if (normalized.length !== expectedHexLength || !hexPattern.test(normalized)) {
    throw new Error(
      `Environment variable ${key} must be a ${expectedHexLength}-character hex string.`,
    );
  }

  return normalized;
};

// 1. App Configuration
const nodeEnv = getEnvVariable("NODE_ENV", "development");
export const appConfig = {
  port: getEnvVarAsNumber("PORT", 8000),
  nodeEnv,
  isDevelopment: nodeEnv === "development",
  isProduction: nodeEnv === "production",
  isTesting: nodeEnv === "testing",
  betterAuthSecret: ensureMinLength(
    "BETTER_AUTH_SECRET",
    getEnvVariable("BETTER_AUTH_SECRET"),
    32,
  ),
  betterAuthUrl: getEnvVariable("BETTER_AUTH_URL", "http://localhost:8000"),
};

// 2. Database Configuration (PostgreSQL)
const pgHost = getEnvVariable("PG_HOST", "localhost");
const pgPort = getEnvVarAsNumber("PG_PORT", 5432);
const pgUser = getEnvVariable("PG_USER");
const pgPassword = getEnvVariable("PG_PASSWORD");
const pgDb = getEnvVariable("PG_DB");
export const dbConfig = {
  host: pgHost,
  port: pgPort,
  user: pgUser,
  password: pgPassword,
  db: pgDb,
  databaseUrl: `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDb}`,
};

// 3. Redis Configuration
const redisHost = getEnvVariable("REDIS_HOST", "localhost");
const redisPort = getEnvVarAsNumber("REDIS_PORT", 6379);
const redisUser = getEnvVariable("REDIS_USER", "default");
const redisPassword = getEnvVariable("REDIS_PASSWORD", "password");
export const redisConfig = {
  host: redisHost,
  port: redisPort,
  user: redisUser,
  password: redisPassword,
  url: `redis://${redisUser}:${redisPassword}@${redisHost}:${redisPort}`,
};

// 4. CORS Configuration
export const corsConfig = {
  allowedOrigins: getEnvVariable(
    "CORS_ORIGIN",
    "http://localhost:3000,http://localhost:3001",
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

// 5. Email Configuration
export const emailConfig = {
  host: getEnvVariable("MAIL_HOST", "localhost"),
  port: getEnvVarAsNumber("MAIL_PORT", 1025),
  from: getEnvVariable("MAIL_FROM", "noreply@interviewer.ai"),
};

// 6. OAuth Configuration
export const oauthConfig = {
  googleClientId: getEnvVariable("GOOGLE_CLIENT_ID", ""),
  googleClientSecret: getEnvVariable("GOOGLE_CLIENT_SECRET", ""),
  githubClientId: getEnvVariable("GITHUB_CLIENT_ID", ""),
  githubClientSecret: getEnvVariable("GITHUB_CLIENT_SECRET", ""),
};

// 7. Judge0 Configuration
export const judge0Config = {
  url: getEnvVariable("JUDGE0_URL", "http://localhost:2358"),
  authToken: getEnvVariable("JUDGE0_AUTH_TOKEN", ""),
};

// 8. Hume AI Configuration
export const humeConfig = {
  apiKey: getEnvVariable("HUME_API_KEY", ""),
  secretKey: getEnvVariable("HUME_SECRET_KEY", ""),
  webhookSigningKey: getEnvVariable("HUME_WEBHOOK_SIGNING_KEY", ""),
  webhookUrl: getEnvVariable("HUME_WEBHOOK_URL", ""),
};

// 9. AI Feedback Configuration
export const aiConfig = {
  provider: getEnvVariable("AI_PROVIDER", "ollama"),
  model: getEnvVariable("AI_MODEL", "qwen3.5:9b"),
  googleApiKey: getEnvVariable("GOOGLE_GENERATIVE_AI_API_KEY", ""),
};

// 10. Unified Export with Flattened Values for Backward Compatibility
export const env = {
  appConfig,
  dbConfig,
  redisConfig,
  corsConfig,
  emailConfig,
  oauthConfig,
  judge0Config,
  humeConfig,
  aiConfig,

  // Flat properties referenced throughout the project codebase
  NODE_ENV: appConfig.nodeEnv,
  PORT: appConfig.port,
  isDevelopment: appConfig.isDevelopment,
  isProduction: appConfig.isProduction,
  isTesting: appConfig.isTesting,
  DATABASE_URL: dbConfig.databaseUrl,
  REDIS_URL: redisConfig.url,
  CORS_ORIGIN: corsConfig.allowedOrigins,
  BETTER_AUTH_SECRET: appConfig.betterAuthSecret,
  BETTER_AUTH_URL: appConfig.betterAuthUrl,
  GOOGLE_CLIENT_ID: oauthConfig.googleClientId,
  GOOGLE_CLIENT_SECRET: oauthConfig.googleClientSecret,
  GITHUB_CLIENT_ID: oauthConfig.githubClientId,
  GITHUB_CLIENT_SECRET: oauthConfig.githubClientSecret,
  JUDGE0_URL: judge0Config.url,
  JUDGE0_AUTH_TOKEN: judge0Config.authToken,
  HUME_API_KEY: humeConfig.apiKey,
  HUME_SECRET_KEY: humeConfig.secretKey,
  HUME_WEBHOOK_SIGNING_KEY: humeConfig.webhookSigningKey,
  HUME_WEBHOOK_URL: humeConfig.webhookUrl,
  AI_PROVIDER: aiConfig.provider,
  AI_MODEL: aiConfig.model,
  GOOGLE_GENERATIVE_AI_API_KEY: aiConfig.googleApiKey,
  MAIL_HOST: emailConfig.host,
  MAIL_PORT: emailConfig.port,
  MAIL_FROM: emailConfig.from,
};

// Print loaded configuration status
console.info(
  env.isDevelopment
    ? chalk.dim(
        `Loaded structured environment configurations:\n${JSON.stringify(
          {
            appConfig: { ...appConfig, betterAuthSecret: "***" },
            dbConfig: { ...dbConfig, password: "***" },
            redisConfig: { ...redisConfig, password: "***" },
            corsConfig,
            emailConfig,
            oauthConfig: {
              ...oauthConfig,
              googleClientSecret: "***",
              githubClientSecret: "***",
            },
            judge0Config: { ...judge0Config, authToken: "***" },
            humeConfig: {
              ...humeConfig,
              apiKey: "***",
              secretKey: "***",
              webhookSigningKey: "***",
            },
            aiConfig: { ...aiConfig, googleApiKey: "***" },
          },
          null,
          2,
        )}`,
      )
    : chalk.dim("Loaded environment configuration variables."),
);
