import { env } from "@/core/env";
import { logger } from "@/lib/logger";

export type Judge0SubmissionRequest = {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
};

export type Judge0SubmissionResponse = {
  token: string;
};

export type Judge0Result = {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
  status: { id: number; description: string };
  token: string;
};

export class Judge0Client {
  private readonly baseUrl: string;
  private readonly headers: Record<string, string>;

  constructor(baseUrl: string, authToken?: string) {
    this.baseUrl = baseUrl;
    this.headers = {
      "Content-Type": "application/json",
    };
    if (authToken) {
      this.headers["X-Auth-Token"] = authToken;
    }
  }

  async submit(
    params: Judge0SubmissionRequest,
  ): Promise<Judge0SubmissionResponse> {
    logger.info({ language_id: params.language_id }, "Submitting to Judge0");

    const res = await fetch(
      `${this.baseUrl}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(params),
      },
    );

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Judge0 submit failed (${res.status}): ${body}`);
    }

    return res.json() as Promise<Judge0SubmissionResponse>;
  }

  async getResult(
    token: string,
    maxRetries = 20,
    delayMs = 100,
  ): Promise<Judge0Result> {
    for (let i = 0; i < maxRetries; i++) {
      const res = await fetch(
        `${this.baseUrl}/submissions/${token}?base64_encoded=false&fields=stdout,stderr,compile_output,message,time,memory,status,token`,
        { headers: this.headers },
      );

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Judge0 getResult failed (${res.status}): ${body}`);
      }

      const result = (await res.json()) as Judge0Result;

      if (result.status.id >= 3) {
        return result;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    throw new Error(`Judge0 polling timeout for token: ${token}`);
  }

  async execute(params: Judge0SubmissionRequest): Promise<Judge0Result> {
    const { token } = await this.submit(params);
    return this.getResult(token);
  }

  async executeTestCases(
    sourceCode: string,
    languageId: number,
    testCases: { input: string; expectedOutput: string }[],
    timeLimitSec: number,
    memoryLimitKb: number,
  ) {
    const submissions = await Promise.all(
      testCases.map((tc) =>
        this.submit({
          source_code: sourceCode,
          language_id: languageId,
          stdin: tc.input,
          expected_output: tc.expectedOutput,
          cpu_time_limit: timeLimitSec,
          memory_limit: memoryLimitKb,
        }),
      ),
    );

    const results = await Promise.all(
      submissions.map((s) => this.getResult(s.token)),
    );

    return results;
  }
}

export const judge0 = new Judge0Client(
  env.JUDGE0_URL,
  env.JUDGE0_AUTH_TOKEN || undefined,
);
