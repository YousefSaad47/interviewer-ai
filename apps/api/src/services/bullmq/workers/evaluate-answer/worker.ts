import { Worker } from "bullmq";

import { evaluateAnswer } from "@/lib/feedback-evaluator";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { connection } from "@/services/bullmq/connection";
import type { EvaluateAnswerJobData } from "@/services/bullmq/queues";

export const evaluateAnswerWorker = new Worker<EvaluateAnswerJobData>(
  "evaluate-answer",
  async (job) => {
    const { answerId, questionText, transcript, suggestedAnswer } = job.data;

    logger.info({ answerId }, "Evaluating answer with AI");

    const feedback = await evaluateAnswer(
      questionText,
      transcript,
      suggestedAnswer,
    );

    await prisma.answerFeedback.updateMany({
      where: { answerId },
      data: {
        strengths: feedback.strengths,
        improvements: feedback.improvements,
        idealAnswer: feedback.idealAnswer,
        detailLevel: feedback.detailLevel,
        relevanceScore: feedback.relevanceScore,
        technicalAccuracy: feedback.technicalAccuracy,
        overallScore: feedback.overallScore,
      },
    });

    logger.info({ answerId }, "Answer evaluation complete");
  },
  { connection, concurrency: 3 },
);
