import type { OptimizedResumeOutput } from "../resume-export.schema";
import type { ResumeContent } from "../resume-export.types";

interface NormalizedSkillCategory {
  category: string;
  items: string[];
}

export interface NormalizedResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    linkedin?: string | undefined;
    github?: string | undefined;
  };
  workExperience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  projects: Array<{
    name: string;
    role: string;
    duration: string;
    description: string;
    url?: string | undefined;
  }>;
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  skills: NormalizedSkillCategory[];
  summary: string;
}

export function normalizeResumeForExport(
  content: ResumeContent,
): NormalizedResumeData {
  const skills: NormalizedSkillCategory[] = normalizeSkills(content.skills);

  return {
    personalInfo: {
      fullName: content.personalInfo.fullName,
      email: content.personalInfo.email || "",
      phone: content.personalInfo.phone || "",
      location: content.personalInfo.location || "",
      summary: content.personalInfo.summary || "",
      linkedin: content.personalInfo.linkedin || undefined,
      github: content.personalInfo.github || undefined,
    },
    workExperience: (content.workExperience || []).map((w) => ({
      company: w.company,
      position: w.position,
      duration: w.duration || "",
      description: w.description || "",
    })),
    projects: (content.projects || []).map((p) => ({
      name: p.name,
      role: p.role || "",
      duration: p.duration || "",
      description: p.description || "",
      url: p.url || undefined,
    })),
    education: (content.education || []).map((e) => ({
      school: e.school,
      degree: e.degree,
      year: e.year || "",
    })),
    skills,
    summary: content.personalInfo.summary || "",
  };
}

function normalizeSkills(
  skills: string[] | Array<{ id?: string; category: string; items: string[] }>,
): NormalizedSkillCategory[] {
  if (!skills || !Array.isArray(skills) || skills.length === 0) return [];

  if (typeof skills[0] === "string") {
    return [
      {
        category: "Skills",
        items: skills as string[],
      },
    ];
  }

  return (
    skills as Array<{ id?: string; category: string; items: string[] }>
  ).map((s) => ({
    category: s.category,
    items: s.items,
  }));
}

export function mergeOptimizedResume(
  original: NormalizedResumeData,
  optimized: OptimizedResumeOutput,
): NormalizedResumeData {
  return {
    personalInfo: {
      fullName: original.personalInfo.fullName,
      email: original.personalInfo.email,
      phone: original.personalInfo.phone,
      location: original.personalInfo.location,
      summary:
        optimized.summary ||
        optimized.personalInfo.summary ||
        original.personalInfo.summary,
      linkedin: original.personalInfo.linkedin,
      github: original.personalInfo.github,
    },
    workExperience:
      optimized.workExperience.length > 0
        ? optimized.workExperience
        : original.workExperience,
    projects:
      optimized.projects.length > 0 ? optimized.projects : original.projects,
    education:
      optimized.education.length > 0 ? optimized.education : original.education,
    skills: optimized.skills.length > 0 ? optimized.skills : original.skills,
    summary:
      optimized.summary || optimized.personalInfo.summary || original.summary,
  };
}
