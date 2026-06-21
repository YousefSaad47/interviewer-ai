import { generateText, Output } from "ai";
import { z } from "zod";

import { getAIModel } from "@/services/ai-sdk";

const feedbackSchema = z.object({
  strengths: z
    .array(z.string())
    .describe("2-3 specific things the candidate did well"),
  improvements: z
    .array(z.string())
    .describe("2-3 actionable areas for improvement"),
  idealAnswer: z.string().describe("A concise model answer for this question"),
  detailLevel: z
    .enum(["too brief", "just right", "too detailed"])
    .describe("Whether the answer had enough detail"),
  relevanceScore: z
    .number()
    .min(0)
    .max(100)
    .describe("How relevant the answer was to the question"),
  technicalAccuracy: z
    .number()
    .min(0)
    .max(100)
    .describe("How technically accurate the answer was"),
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe("Overall quality score for the answer"),
});

export type AnswerFeedback = z.infer<typeof feedbackSchema>;

const SYSTEM_PROMPT =
  "You are an expert technical interviewer evaluating a candidate's answer. " +
  "Provide honest, constructive feedback. Be specific about what was good and what could improve. " +
  "Keep strengths and improvements to 2-3 items each. " +
  "If a suggested answer is provided, use it as a reference but judge the candidate's answer on its own merits.";

export async function evaluateAnswer(
  question: string,
  transcript: string,
  suggestedAnswer?: string | null,
): Promise<AnswerFeedback> {
  let prompt = `Question: ${question}\n\nCandidate's Answer: ${transcript}`;
  if (suggestedAnswer) {
    prompt += `\n\nSuggested Answer: ${suggestedAnswer}`;
  }

  const result = await generateText({
    model: getAIModel(),
    output: Output.object({ schema: feedbackSchema }),
    system: SYSTEM_PROMPT,
    prompt,
    temperature: 0.3,
    maxRetries: 3,
  });

  return result.output;
}
