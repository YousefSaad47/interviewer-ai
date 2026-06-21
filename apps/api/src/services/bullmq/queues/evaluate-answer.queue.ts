import { Queue } from "bullmq";

import { connection } from "../connection";

export type EvaluateAnswerJobData = {
  answerId: string;
  questionText: string;
  transcript: string;
  suggestedAnswer?: string | null;
};

export const evaluateAnswerQueue = new Queue<EvaluateAnswerJobData>(
  "evaluate-answer",
  {
    connection,
    defaultJobOptions: {
      attempts: 2,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: { count: 500 },
      removeOnFail: { count: 1000 },
    },
  },
);
