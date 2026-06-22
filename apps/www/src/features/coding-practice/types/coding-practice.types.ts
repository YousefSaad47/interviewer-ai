export type Language = "javascript" | "python" | "java" | "cpp" | "typescript";

export interface CodingRunInput {
  code: string;
  language: Language;
}

export interface CodingRunResponse {
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  time: string | null;
  memory: number | null;
}

export interface RunResult {
  output: string | null;
  error: string | null;
  time: string | null;
  memory: number | null;
}

export interface SubmissionResult {
  passed: boolean;
  output: string | null;
  error: string | null;
}

export interface LastSubmission {
  status: string;
  executionTimeMs: number | null;
  memoryUsedKb: number | null;
  results: SubmissionResult[];
}

export interface CodingSubmissionPollResponse {
  id: string;
  status: string;
  executionTimeMs?: number | null;
  memoryUsedKb?: number | null;
  results?: SubmissionResult[];
}
