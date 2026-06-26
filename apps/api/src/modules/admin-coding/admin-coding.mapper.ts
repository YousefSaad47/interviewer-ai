/** biome-ignore-all lint/complexity/noStaticOnlyClass: mapper namespace follows the module's OOP style */

import type {
  AdminCodingSubmissionDetailsRecord,
  AdminCodingSubmissionListRecord,
} from "./admin-coding.repository";
import type {
  AdminCodingSubmissionDetails,
  AdminCodingSubmissionListItem,
} from "./admin-coding.schema";
import { calculateCodingScore } from "./admin-coding.scoring";

export class AdminCodingMapper {
  public static toListItem(
    submission: AdminCodingSubmissionListRecord,
  ): AdminCodingSubmissionListItem {
    return {
      id: submission.id,
      user: {
        id: submission.user.id,
        name: submission.user.name,
        email: submission.user.email,
        image: submission.user.image,
      },
      problem: {
        id: submission.problem.id,
        title: submission.problem.title,
        slug: submission.problem.slug,
        difficulty: submission.problem.difficulty,
      },
      language: submission.language,
      status: submission.status,
      score: calculateCodingScore(submission),
      executionTimeMs: submission.executionTimeMs,
      memoryUsedKb: submission.memoryUsedKb,
      createdAt: submission.createdAt.toISOString(),
    };
  }

  public static toDetails(
    submission: AdminCodingSubmissionDetailsRecord,
  ): AdminCodingSubmissionDetails {
    return {
      ...AdminCodingMapper.toListItem(submission),
      problem: {
        id: submission.problem.id,
        title: submission.problem.title,
        slug: submission.problem.slug,
        difficulty: submission.problem.difficulty,
        description: submission.problem.description,
        constraints: submission.problem.constraints,
      },
      code: submission.code,
      scores: {
        logic: submission.logicScore,
        naming: submission.namingScore,
        efficiency: submission.efficiencyScore,
        bestPractices: submission.bestPracticesScore,
      },
      aiFeedback: submission.aiFeedback,
      results: submission.results.map((result) => ({
        id: result.id,
        passed: result.passed,
        output: result.output,
        error: result.error,
        testCase: {
          id: result.testCase.id,
          isHidden: result.testCase.isHidden,
          sortOrder: result.testCase.sortOrder,
          ...(!result.testCase.isHidden && {
            input: result.testCase.input,
            output: result.testCase.output,
          }),
        },
      })),
    };
  }
}
