import { Queue } from "bullmq";

import { connection } from "../connection";

export type EmailJobData = {
  to: string;
  template: "verify-email" | "reset-password";
  props: {
    username: string;
    url: string;
  };
};

export const emailQueue = new Queue<EmailJobData>("emails", {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 5000 },
  },
});
