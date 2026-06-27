import { AbstractService } from "@/common/contracts";
import { Prisma } from "@/generated/client";

import type { ResumeContent, ResumeSaveInput } from "./resumes.schema";

const buildTitle = (content: ResumeContent, title?: string): string => {
  if (title) {
    return title;
  }

  const fullName = content.personalInfo.fullName.trim();
  return fullName ? `${fullName} Resume` : "Untitled Resume";
};

export class ResumesService extends AbstractService {
  public async getMine(userId: string) {
    const resume = await this.prisma.resume.findFirst({
      where: { userId, status: { not: "ARCHIVED" } },
      orderBy: { updatedAt: "desc" },
    });

    return resume ? this._toResponse(resume) : null;
  }

  public async saveMine(userId: string, input: ResumeSaveInput) {
    const existingResume = await this.prisma.resume.findFirst({
      where: { userId, status: { not: "ARCHIVED" } },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });
    const title = buildTitle(input.content, input.title);

    const resume = existingResume
      ? await this.prisma.resume.update({
          where: { id: existingResume.id },
          data: {
            title,
            content: input.content,
            status: "DRAFT",
          },
        })
      : await this.prisma.resume.create({
          data: {
            title,
            content: input.content,
            status: "DRAFT",
            suggestions: [],
            userId,
          },
        });

    return this._toResponse(resume);
  }

  private _toResponse(resume: {
    id: string;
    title: string;
    status: "DRAFT" | "COMPLETE" | "ARCHIVED";
    content: Prisma.JsonValue;
    atsScore: number | null;
    grammarScore: number | null;
    suggestions: string[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      id: resume.id,
      title: resume.title,
      status: resume.status,
      content: resume.content as ResumeContent,
      atsScore: resume.atsScore,
      grammarScore: resume.grammarScore,
      suggestions: resume.suggestions,
      createdAt: resume.createdAt.toISOString(),
      updatedAt: resume.updatedAt.toISOString(),
    };
  }
}
