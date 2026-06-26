/** biome-ignore-all lint/complexity/noStaticOnlyClass: mapper namespace follows the module's OOP style */

import type { Prisma } from "@/generated/client";

import type {
  AdminResumeDetailsRecord,
  AdminResumeListRecord,
} from "./admin-resumes.repository";
import type {
  AdminResumeContentPreview,
  AdminResumeDetails,
  AdminResumeListItem,
} from "./admin-resumes.schema";

type JsonRecord = {
  [key: string]: Prisma.JsonValue;
};

export class AdminResumesMapper {
  public static toListItem(resume: AdminResumeListRecord): AdminResumeListItem {
    return {
      id: resume.id,
      candidate: {
        id: resume.user.id,
        name: resume.user.name,
        email: resume.user.email,
        image: resume.user.image,
      },
      title: resume.title,
      status: resume.status,
      atsScore: resume.atsScore,
      grammarScore: resume.grammarScore,
      suggestionsCount: resume.suggestions.length,
      matchesCount: resume._count.matches,
      createdAt: resume.createdAt.toISOString(),
      updatedAt: resume.updatedAt.toISOString(),
    };
  }

  public static toDetails(
    resume: AdminResumeDetailsRecord,
  ): AdminResumeDetails {
    const listItem = AdminResumesMapper.toListItem(resume);

    return {
      id: listItem.id,
      candidate: listItem.candidate,
      title: listItem.title,
      status: listItem.status,
      atsScore: listItem.atsScore,
      grammarScore: listItem.grammarScore,
      suggestions: resume.suggestions,
      contentPreview: buildContentPreview(resume.content),
      matches: resume.matches.map((match) => ({
        id: match.id,
        matchPct: match.matchPct,
        jobTitle: match.jobDescription.title,
        company: match.jobDescription.company,
        matchedKeywords: match.matchedKeywords,
        missingKeywords: match.missingKeywords,
      })),
      createdAt: listItem.createdAt,
      updatedAt: listItem.updatedAt,
    };
  }
}

const buildContentPreview = (
  content: Prisma.JsonValue,
): AdminResumeContentPreview => {
  if (!isJsonRecord(content)) {
    return {};
  }

  const personalInfo = getRecordValue(content, [
    "personalInfo",
    "personal",
    "profile",
    "contact",
  ]);

  const source = personalInfo ?? content;
  const skillsValue = getValueByKeys(content, ["skills", "skill"]);
  const experienceValue = getValueByKeys(content, [
    "experience",
    "experiences",
    "workExperience",
    "employment",
  ]);
  const educationValue = getValueByKeys(content, ["education", "educations"]);

  return {
    ...stringField(source, "fullName", ["fullName", "name"]),
    ...stringField(source, "email", ["email"]),
    ...stringField(source, "phone", ["phone", "phoneNumber"]),
    ...stringField(source, "location", ["location", "address"]),
    ...stringField(content, "summary", ["summary", "professionalSummary"]),
    ...skillsField(skillsValue),
    ...countField("experienceCount", experienceValue),
    ...countField("educationCount", educationValue),
  };
};

const isJsonRecord = (value: Prisma.JsonValue): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const getValueByKeys = (
  source: JsonRecord,
  keys: readonly string[],
): Prisma.JsonValue | undefined => {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined) {
      return value;
    }
  }

  return undefined;
};

const getRecordValue = (
  source: JsonRecord,
  keys: readonly string[],
): JsonRecord | undefined => {
  const value = getValueByKeys(source, keys);
  return value && isJsonRecord(value) ? value : undefined;
};

const stringField = <TKey extends keyof AdminResumeContentPreview>(
  source: JsonRecord,
  field: TKey,
  keys: readonly string[],
): Partial<Pick<AdminResumeContentPreview, TKey>> => {
  const value = getValueByKeys(source, keys);

  if (typeof value !== "string" || value.trim().length === 0) {
    return {};
  }

  return { [field]: value } as Partial<Pick<AdminResumeContentPreview, TKey>>;
};

const skillsField = (
  value: Prisma.JsonValue | undefined,
): Pick<AdminResumeContentPreview, "skills"> | Record<string, never> => {
  if (!Array.isArray(value)) {
    return {};
  }

  const skills = value.filter(
    (item): item is string =>
      typeof item === "string" && item.trim().length > 0,
  );

  return skills.length > 0 ? { skills } : {};
};

const countField = <TKey extends "experienceCount" | "educationCount">(
  field: TKey,
  value: Prisma.JsonValue | undefined,
): Pick<AdminResumeContentPreview, TKey> | Record<string, never> => {
  if (Array.isArray(value)) {
    return { [field]: value.length } as Pick<AdminResumeContentPreview, TKey>;
  }

  return {};
};
