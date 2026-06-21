import { AbstractService } from "@/common/contracts";
import { BadRequestException } from "@/common/exceptions";
import {
  type CodingProblem,
  type PrismaClient,
  SubmissionStatus,
  type TestCase,
} from "@/generated/client";
import { logger } from "@/lib/logger";
import { Judge0Client } from "@/services/judge0/judge0";
import { LANGUAGE_TO_JUDGE0_ID } from "@/services/judge0/judge0-languages";

import { computeAstHash } from "./ast-hasher";
import { CodingCacheService } from "./coding.cache";
import type { CodingRunInput, CodingSubmitInput } from "./coding.schema";

export class CodingService extends AbstractService {
  constructor(
    prisma: PrismaClient,
    private readonly judge0: Judge0Client,
    private readonly cacheService: CodingCacheService,
  ) {
    super(prisma);
  }

  async run(_userId: string, input: CodingRunInput) {
    const languageId = LANGUAGE_TO_JUDGE0_ID[input.language];
    if (!languageId) {
      throw new BadRequestException(`Unsupported language: ${input.language}`);
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
      throw new BadRequestException(`Unsupported language: ${input.language}`);
    }

    const astHash = await computeAstHash(input.code, input.language);

    if (astHash) {
      const cachedData = await this.cacheService.getSubmission(
        input.problemId,
        input.language,
        astHash,
      );

      if (cachedData) {
        logger.info(
          { problemId: input.problemId, language: input.language, astHash },
          "AST cache hit — skipping Judge0 execution",
        );
        const newSubmission = await this.prisma.codingSubmission.create({
          data: {
            code: input.code,
            language: input.language,
            status: cachedData.status,
            problemId: problem.id,
            userId,
            astHash,
            executionTimeMs: cachedData.executionTimeMs,
            memoryUsedKb: cachedData.memoryUsedKb,
          },
        });

        if (cachedData.results && cachedData.results.length > 0) {
          await this.prisma.codingSubmissionResult.createMany({
            data: cachedData.results.map(
              (r: {
                passed: boolean;
                output: string | null;
                error: string | null;
                testCaseId: string;
              }) => ({
                passed: r.passed,
                output: r.output,
                error: r.error,
                submissionId: newSubmission.id,
                testCaseId: r.testCaseId,
              }),
            ),
          });
        }

        return { id: newSubmission.id, status: newSubmission.status };
      }
    }

    const submission = await this.prisma.codingSubmission.create({
      data: {
        code: input.code,
        language: input.language,
        status: SubmissionStatus.PENDING,
        problemId: problem.id,
        userId,
        astHash,
      },
    });

    this._processSubmission(
      submission.id,
      input.code,
      languageId,
      problem,
    ).catch((err) => {
      logger.error(
        { err, submissionId: submission.id },
        "Failed to process submission",
      );
    });

    return { id: submission.id, status: submission.status };
  }

  private async _processSubmission(
    submissionId: string,
    code: string,
    languageId: number,
    problem: CodingProblem & { testCases: TestCase[] },
  ) {
    try {
      const results = await this.judge0.executeTestCases(
        code,
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
              submissionId,
              testCaseId: testCase.id,
            },
          });
        }),
      );

      if (allPassed) granularStatus = SubmissionStatus.ACCEPTED;
      else if (granularStatus === SubmissionStatus.ACCEPTED)
        granularStatus = SubmissionStatus.WRONG_ANSWER;

      const submissionRecord = await this.prisma.codingSubmission.update({
        where: { id: submissionId },
        data: {
          status: granularStatus,
          executionTimeMs: Math.round(totalTimeMs),
          memoryUsedKb: maxMemoryKb,
          judge0Token: results[0]?.token ?? null,
        },
        include: { results: true },
      });

      // Cache the successful/failed results using the AST Hash
      if (submissionRecord.astHash) {
        await this.cacheService.setSubmission(
          problem.id,
          submissionRecord.language,
          submissionRecord.astHash,
          {
            status: submissionRecord.status,
            executionTimeMs: submissionRecord.executionTimeMs,
            memoryUsedKb: submissionRecord.memoryUsedKb,
            results: submissionRecord.results.map((r) => ({
              passed: r.passed,
              output: r.output,
              error: r.error,
              testCaseId: r.testCaseId,
            })),
          },
        );
      }
    } catch (err) {
      await this.prisma.codingSubmission.update({
        where: { id: submissionId },
        data: { status: SubmissionStatus.RUNTIME_ERROR },
      });
      throw err;
    }
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
    const submission = await this.prisma.codingSubmission.findFirstOrThrow({
      where: { id: submissionId, userId },
      include: {
        problem: { select: { id: true, title: true, difficulty: true } },
        results: { orderBy: { createdAt: "asc" }, include: { testCase: true } },
      },
    });

    if (submission.status === SubmissionStatus.PENDING) {
      return { id: submission.id, status: submission.status };
    }

    return submission;
  }
}
