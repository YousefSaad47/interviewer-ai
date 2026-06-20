import { getRedis } from "@/core/redis";
import type { SubmissionStatus } from "@/generated/client";

export interface CachedSubmissionData {
  status: SubmissionStatus;
  executionTimeMs: number | null;
  memoryUsedKb: number | null;
  results: {
    passed: boolean;
    output: string | null;
    error: string | null;
    testCaseId: string;
  }[];
}

export class CodingCacheService {
  private static readonly CACHE_TTL_SECONDS = 60 * 60 * 24 * 7;

  private getCacheKey(
    problemId: string,
    language: string,
    astHash: string,
  ): string {
    return `coding_ast_cache:${problemId}:${language}:${astHash}`;
  }

  async getSubmission(
    problemId: string,
    language: string,
    astHash: string,
  ): Promise<CachedSubmissionData | null> {
    const key = this.getCacheKey(problemId, language, astHash);
    const cached = await getRedis().get(key);

    if (!cached) return null;

    try {
      return JSON.parse(cached) as CachedSubmissionData;
    } catch (err) {
      console.error("Failed to parse cached submission:", err);
      return null;
    }
  }

  async setSubmission(
    problemId: string,
    language: string,
    astHash: string,
    data: CachedSubmissionData,
  ): Promise<void> {
    const key = this.getCacheKey(problemId, language, astHash);
    await getRedis().set(
      key,
      JSON.stringify(data),
      "EX",
      CodingCacheService.CACHE_TTL_SECONDS,
    );
  }
}

export const codingCacheService = new CodingCacheService();
