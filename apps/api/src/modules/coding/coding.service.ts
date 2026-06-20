import { AbstractService } from "@/common/contracts";
import { type PrismaClient, SubmissionStatus } from "@/generated/client";
import { Judge0Client } from "@/services/judge0/judge0";
import { LANGUAGE_TO_JUDGE0_ID } from "@/services/judge0/judge0-languages";

import type { CodingRunInput, CodingSubmitInput } from "./coding.schema";

export class CodingService extends AbstractService {
  constructor(
    prisma: PrismaClient,
    private readonly judge0: Judge0Client,
  ) {
    super(prisma);
  }

  async run(_userId: string, input: CodingRunInput) {
    const languageId = LANGUAGE_TO_JUDGE0_ID[input.language];
    if (!languageId) {
      throw new Error(`Unsupported language: ${input.language}`);
    }

    const result = await this.judge0.execute({
      source_code: input.code,
      language_id: languageId,
      stdin: input.stdin ?? "",
    });

    return {
      stdout: result.stdout,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      time: result.time,
      memory: result.memory,
      status: result.status,
    };
  }

  async submit(userId: string, input: CodingSubmitInput) {
    const problem = await this.prisma.codingProblem.findUniqueOrThrow({
      where: { id: input.problemId },
      include: { testCases: { orderBy: { sortOrder: "asc" } } },
    });

    const languageId = LANGUAGE_TO_JUDGE0_ID[input.language];
    if (!languageId) {
      throw new Error(`Unsupported language: ${input.language}`);
    }

    const submission = await this.prisma.codingSubmission.create({
      data: {
        code: input.code,
        language: input.language,
        status: SubmissionStatus.PENDING,
        problemId: problem.id,
        userId,
      },
    });

    const results = await this.judge0.executeTestCases(
      input.code,
      languageId,
      problem.testCases.map((tc) => ({
        input: tc.input,
        expectedOutput: tc.output,
      })),
      problem.timeLimitMs / 1000,
      problem.memoryLimitKb,
    );

    let allPassed = true;
    let totalTimeMs = 0;
    let maxMemoryKb = 0;
    let granularStatus: SubmissionStatus = SubmissionStatus.ACCEPTED;

    await Promise.all(
      problem.testCases.map(async (testCase, index) => {
        const result = results[index];
        if (!result) return;

        const passed = result.status.id === 3;
        if (!passed) allPassed = false;

        const timeSec = Number.parseFloat(result.time ?? "0");
        totalTimeMs += timeSec * 1000;
        if (result.memory && result.memory > maxMemoryKb) {
          maxMemoryKb = result.memory;
        }

        if (result.status.id === 5)
          granularStatus = SubmissionStatus.TIME_LIMIT_EXCEEDED;
        if (result.status.id === 6)
          granularStatus = SubmissionStatus.COMPILATION_ERROR;
        if (result.status.id >= 7)
          granularStatus = SubmissionStatus.RUNTIME_ERROR;

        return this.prisma.codingSubmissionResult.create({
          data: {
            passed,
            output: result.stdout,
            error: result.stderr || result.compile_output,
            submissionId: submission.id,
            testCaseId: testCase.id,
          },
        });
      }),
    );

    if (allPassed) granularStatus = SubmissionStatus.ACCEPTED;
    else if (granularStatus === SubmissionStatus.ACCEPTED)
      granularStatus = SubmissionStatus.WRONG_ANSWER;

    await this.prisma.codingSubmission.update({
      where: { id: submission.id },
      data: {
        status: granularStatus,
        executionTimeMs: Math.round(totalTimeMs),
        memoryUsedKb: maxMemoryKb,
        judge0Token: results[0]?.token ?? null,
      },
    });

    return this.prisma.codingSubmission.findUniqueOrThrow({
      where: { id: submission.id },
      include: {
        results: { orderBy: { createdAt: "asc" } },
        problem: { select: { id: true, title: true, difficulty: true } },
      },
    });
  }

  async getSubmissions(userId: string) {
    return this.prisma.codingSubmission.findMany({
      where: { userId },
      include: {
        problem: { select: { id: true, title: true, difficulty: true } },
        results: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getSubmission(submissionId: string, userId: string) {
    return this.prisma.codingSubmission.findFirstOrThrow({
      where: { id: submissionId, userId },
      include: {
        problem: { select: { id: true, title: true, difficulty: true } },
        results: { orderBy: { createdAt: "asc" }, include: { testCase: true } },
      },
    });
  }
}
