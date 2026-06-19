import { logger } from "@/lib/logger";

const { emailWorker } = await import("@/services/bullmq/workers/email/worker");

logger.info("Email worker started");

const shutdown = async () => {
  logger.info("Shutting down email worker...");
  await emailWorker.pause();
  await emailWorker.close();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
