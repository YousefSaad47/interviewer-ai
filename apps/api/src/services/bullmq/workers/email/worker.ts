import { Worker } from "bullmq";

import { sendEmailDirect } from "@/lib/email";
import { logger } from "@/lib/logger";

import { connection } from "../../connection";
import { type EmailJobData, emailQueue } from "../../queues";

export const emailWorker = new Worker<EmailJobData>(
  emailQueue.name,
  async (job) => {
    await sendEmailDirect(job.data.to, job.data.template, job.data.props);
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 100,
      duration: 60_000,
    },
  },
);

emailWorker.on("completed", (job) => {
  logger.info(
    `Email job ${job.id} completed → ${job.data.to} [${job.data.template}]`,
  );
});

emailWorker.on("failed", (job, err) => {
  logger.error(
    { err, jobId: job?.id },
    `Email job failed → ${job?.data.to} [${job?.data.template}]`,
  );
});

emailWorker.on("stalled", (jobId) => {
  logger.warn(`Email job ${jobId} stalled`);
});
