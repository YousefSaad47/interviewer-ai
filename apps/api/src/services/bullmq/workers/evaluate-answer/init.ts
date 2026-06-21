import { logger } from "@/lib/logger";

const { evaluateAnswerWorker } = await import(
  "@/services/bullmq/workers/evaluate-answer/worker"
);

logger.info("Evaluate answer worker started");

const shutdown = async () => {
  logger.info("Shutting down evaluate answer worker...");
  await evaluateAnswerWorker.pause();
  await evaluateAnswerWorker.close();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
