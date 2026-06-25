import { AbstractService } from "@/common/contracts";
import { NotFoundException } from "@/common/exceptions";
import { type Prisma, ProblemDifficulty } from "@/generated/client";

import { decodeCursor, encodeCursor } from "./cursor.util";
import type { ProblemQuery } from "./problem.schema";

export class ProblemService extends AbstractService {
  async list(query: ProblemQuery) {
    const { cursor, limit, difficulty, search } = query;

    const where = this._buildWhere(difficulty, search);

    const cursorCondition = cursor ? decodeCursor(cursor) : null;

    const problems = await this.prisma.codingProblem.findMany({
      where,
      take: limit + 1,
      ...(cursorCondition && {
        cursor: { id: cursorCondition.id },
        skip: 1,
      }),
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      include: {
        testCases: { select: { id: true } },
      },
    });

    const hasNextPage = problems.length > limit;
    const data = hasNextPage ? problems.slice(0, limit) : problems;

    return {
      data: data.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        difficulty: p.difficulty,
        description: p.description,
        constraints: p.constraints,
        examples: p.examples,
        testCaseCount: p.testCases.length,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
      nextCursor: hasNextPage ? this._encodeNextCursor(data) : null,
    };
  }

  async getBySlug(slug: string) {
    const problem = await this.prisma.codingProblem.findUnique({
      where: { slug },
      include: {
        testCases: { select: { id: true }, orderBy: { sortOrder: "asc" } },
      },
    });

    if (!problem) {
      throw new NotFoundException("Problem not found");
    }

    return {
      id: problem.id,
      slug: problem.slug,
      title: problem.title,
      difficulty: problem.difficulty,
      description: problem.description,
      constraints: problem.constraints,
      examples: problem.examples,
      testCaseCount: problem.testCases.length,
      createdAt: problem.createdAt.toISOString(),
      updatedAt: problem.updatedAt.toISOString(),
    };
  }

  private _encodeNextCursor(
    data: { id: string; createdAt: Date }[],
  ): string | null {
    const lastProblem = data.at(-1);
    if (!lastProblem) {
      return null;
    }

    return encodeCursor(lastProblem.id, lastProblem.createdAt.toISOString());
  }

  private _buildWhere(
    difficulty?: ProblemDifficulty,
    search?: string,
  ): Prisma.CodingProblemWhereInput {
    let where: Prisma.CodingProblemWhereInput = {};

    if (difficulty) {
      where = {
        AND: [where, { difficulty }],
      };
    }

    if (search) {
      where = {
        AND: [
          where,
          {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          },
        ],
      };
    }

    return where;
  }
}
