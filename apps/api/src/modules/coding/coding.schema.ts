import { z } from "zod";

import { SubmissionStatus } from "@/generated/enums";

import {
  createCodingResult,
  createCodingSubmissionResponse,
  createCodingSubmitInput,
} from "./coding.fixtures";

export const SUPPORTED_LANGUAGES = [
  "assembly",
  "bash",
  "basic",
  "c",
  "cpp",
  "clojure",
  "csharp",
  "cobol",
  "common-lisp",
  "d",
  "elixir",
  "erlang",
  "fsharp",
  "fortran",
  "go",
  "groovy",
  "haskell",
  "java",
  "javascript",
  "kotlin",
  "lua",
  "objective-c",
  "ocaml",
  "octave",
  "pascal",
  "perl",
  "php",
  "prolog",
  "python",
  "python2",
  "r",
  "ruby",
  "rust",
  "scala",
  "sql",
  "swift",
  "typescript",
  "vb",
] as const;

type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const codingSubmitSchema = z
  .object({
    problemId: z.uuid(),
    code: z.string().min(1, { error: "Code is required" }),
    language: z
      .string()
      .min(1, { error: "Language is required" })
      .refine(
        (val): val is Language =>
          (SUPPORTED_LANGUAGES as readonly string[]).includes(val),
        "Unsupported language",
      ),
  })
  .openapi("CodingSubmitRequest", {
    default: createCodingSubmitInput(),
  });

export const codingRunSchema = z.object({
  code: z.string().min(1, { error: "Code is required" }),
  language: z
    .string()
    .min(1, { error: "Language is required" })
    .refine(
      (val): val is Language =>
        (SUPPORTED_LANGUAGES as readonly string[]).includes(val),
      "Unsupported language",
    ),
  stdin: z.string().optional(),
});

export type CodingRunInput = z.infer<typeof codingRunSchema>;

export type CodingSubmitInput = z.infer<typeof codingSubmitSchema>;

const submissionStatus = z.enum(SubmissionStatus);

const problemDifficulty = z.enum(["EASY", "MEDIUM", "HARD"]);

export const codingResultSchema = z
  .object({
    id: z.uuid(),
    passed: z.boolean(),
    output: z.string().nullable(),
    error: z.string().nullable(),
    submissionId: z.uuid(),
    testCaseId: z.uuid(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
  })
  .openapi("CodingResult", {
    default: createCodingResult(),
  });

export const codingSubmissionResponseSchema = z
  .object({
    id: z.uuid(),
    code: z.string(),
    language: z.string(),
    status: submissionStatus,
    judge0Token: z.string().nullable(),
    logicScore: z.number().nullable(),
    namingScore: z.number().nullable(),
    efficiencyScore: z.number().nullable(),
    bestPracticesScore: z.number().nullable(),
    aiFeedback: z.string().nullable(),
    executionTimeMs: z.number().int().nullable(),
    memoryUsedKb: z.number().int().nullable(),
    problemId: z.uuid(),
    userId: z.uuid(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    results: z.array(codingResultSchema),
    problem: z.object({
      id: z.uuid(),
      title: z.string(),
      difficulty: problemDifficulty,
    }),
  })
  .openapi("CodingSubmissionResponse", {
    default: createCodingSubmissionResponse(),
  });
