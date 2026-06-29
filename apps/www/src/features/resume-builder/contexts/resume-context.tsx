"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  downloadBlob,
  exportResumePdf,
  getMyResume,
  saveMyResume,
} from "../api";
import type {
  Education,
  PersonalInfo,
  Project,
  ResumeData,
  SkillCategory,
  WorkExperience,
} from "../types";

interface ResumeContextType {
  data: ResumeData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, updates: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  addProject: () => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: string) => void;
  updateSkill: (index: number, skill: string) => void;
  removeSkill: (index: number) => void;
  // Skill Categories
  addSkillCategory: () => void;
  updateSkillCategory: (id: string, updates: Partial<SkillCategory>) => void;
  removeSkillCategory: (id: string) => void;
  isLoading: boolean;
  isSaving: boolean;
  isExporting: boolean;
  saveError: string | null;
  exportError: string | null;
  savedAt: string | null;
  saveResume: () => Promise<void>;
  exportResume: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const initialData: ResumeData = {
  personalInfo: {
    fullName: "Daniel Covington",
    email: "daniel.covington@example.com",
    phone: "+14155552671",
    location: "San Francisco, CA",
    summary:
      "Senior Frontend Engineer with 6+ years of experience specializing in React, Next.js, and TypeScript. Passionate about building high-performance web applications with exceptional user experience, fluid animations, and robust state management. Strong collaborator with designers and product managers to translate complex requirements into clean, maintainable code.",
    linkedin: "linkedin.com/in/daniel-covington",
    github: "github.com/daniel-covington",
  },
  workExperience: [
    {
      id: "w-1",
      company: "PixelCraft Studios",
      position: "Senior Frontend Engineer",
      duration: "2022-03 - Present",
      description:
        "Led the development of a collaborative real-time UI editor using React, TypeScript, and WebSockets. Optimized bundle sizes by 35% through dynamic imports and tree-shaking. Mentored junior developers and established frontend coding standards.",
    },
    {
      id: "w-2",
      company: "TechFlow Inc",
      position: "Frontend Developer",
      duration: "2020-01 - 2022-02",
      description:
        "Built and maintained responsive SaaS dashboards using React and Redux. Integrated complex RESTful APIs and optimized client-side performance. Collaborated closely with UI/UX designers to implement pixel-perfect user interfaces.",
    },
  ],
  projects: [
    {
      id: "p-1",
      name: "Design System Builder",
      role: "Lead Developer",
      duration: "Jun 2023 - Dec 2023",
      description:
        "Open-source design system builder built with React, TypeScript, and Tailwind CSS. Enables design teams to visually construct, theme, and export production-ready Tailwind/CSS variables and React components. Features live preview, accessibility (WCAG 2.1 AA) validation, and Figma token syncing.",
      url: "https://github.com/sarahj-codes/design-system-builder",
    },
    {
      id: "p-2",
      name: "E-Commerce Checkout Funnel",
      role: "Frontend Engineer",
      duration: "Jan 2024 - Present",
      description:
        "Redesigned and rebuilt the multi-step checkout funnel for a high-traffic e-commerce platform using Next.js and Stripe. Conducted A/B testing and reduced cart abandonment rates by 18%.",
      url: "https://github.com/sarahj-codes/checkout-ux",
    },
    {
      id: "p-3",
      name: "Interactive Analytics Dashboard",
      role: "Frontend Developer",
      duration: "Feb 2023 - May 2023",
      description:
        "Real-time SaaS metrics dashboard built with Vue.js, D3.js, and Pinia. Implemented complex interactive charts, custom filters, and light/dark mode switching.",
      url: "https://github.com/sarahj-codes/dashboard-viz",
    },
  ],
  education: [
    {
      id: "e-1",
      school: "University of California, Berkeley",
      degree: "B.S. in Cognitive Science (Human-Computer Interaction)",
      year: "2016 Ã¢â‚¬â€œ 2020",
    },
  ],
  skills: [
    {
      id: "s-1",
      category: "Frontend Development",
      items: [
        "React",
        "Next.js",
        "TypeScript",
        "JavaScript (ES6+)",
        "HTML5 / CSS3",
        "Tailwind CSS",
        "Framer Motion",
        "State Management (Redux, Zustand)",
      ],
    },
    {
      id: "s-2",
      category: "Testing & Tools",
      items: [
        "Jest",
        "Cypress",
        "React Testing Library",
        "Webpack / Vite",
        "Storybook",
      ],
    },
    {
      id: "s-3",
      category: "Workflow & Cloud",
      items: [
        "Git / GitHub",
        "CI / CD (GitHub Actions)",
        "Figma / Figma API",
        "Vercel / AWS S3",
        "npm / bun",
      ],
    },
  ],
};

const normalizeResumeData = (content: unknown): ResumeData => {
  const normalized: Partial<ResumeData> =
    typeof content === "object" && content !== null ? { ...content } : {};
  if (!normalized.personalInfo) {
    normalized.personalInfo = {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    };
  }
  if (!normalized.workExperience) {
    normalized.workExperience = [];
  }
  if (!normalized.projects) {
    normalized.projects = [];
  }
  if (!normalized.education) {
    normalized.education = [];
  }
  if (!normalized.skills) {
    normalized.skills = [];
  } else if (
    Array.isArray(normalized.skills) &&
    normalized.skills.length > 0 &&
    typeof normalized.skills[0] === "string"
  ) {
    normalized.skills = [
      {
        id: "default-skills",
        category: "Skills",
        items: normalized.skills as string[],
      },
    ];
  }
  return normalized as ResumeData;
};

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ResumeData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const loadResume = async () => {
      try {
        const resume = await getMyResume();
        if (!active) {
          return;
        }

        if (resume) {
          setData(normalizeResumeData(resume.content));
          setSavedAt(resume.updatedAt);
        }
      } catch {
        if (active) {
          setSaveError("Unable to load your saved resume.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadResume();

    return () => {
      active = false;
    };
  }, []);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const addWorkExperience = () => {
    const newExp: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      duration: "",
      description: "",
    };
    setData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExp],
    }));
  };

  const updateWorkExperience = (
    id: string,
    updates: Partial<WorkExperience>,
  ) => {
    setData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.map((exp) =>
        exp.id === id ? { ...exp, ...updates } : exp,
      ),
    }));
  };

  const removeWorkExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((exp) => exp.id !== id),
    }));
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      role: "",
      duration: "",
      description: "",
      url: "",
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updates } : proj,
      ),
    }));
  };

  const removeProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      year: "",
    };
    setData((prev) => ({
      ...prev,
      education: [...prev.education, newEdu],
    }));
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...updates } : edu,
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  // Legacy flat skill functions
  const addSkill = (skill: string) => {
    if (skill.trim()) {
      setData((prev) => {
        if (Array.isArray(prev.skills)) {
          // If flat array
          if (prev.skills.length === 0 || typeof prev.skills[0] === "string") {
            return {
              ...prev,
              skills: [...(prev.skills as string[]), skill.trim()],
            };
          }
          // If categorized, add to the first category
          const updated = [...(prev.skills as SkillCategory[])];
          if (updated[0]) {
            updated[0] = {
              ...updated[0],
              items: [...updated[0].items, skill.trim()],
            };
          }
          return { ...prev, skills: updated };
        }
        return prev;
      });
    }
  };

  const updateSkill = (index: number, skill: string) => {
    setData((prev) => {
      if (Array.isArray(prev.skills)) {
        if (prev.skills.length === 0 || typeof prev.skills[0] === "string") {
          return {
            ...prev,
            skills: (prev.skills as string[]).map((s, i) =>
              i === index ? skill : s,
            ),
          };
        }
      }
      return prev;
    });
  };

  const removeSkill = (index: number) => {
    setData((prev) => {
      if (Array.isArray(prev.skills)) {
        if (prev.skills.length === 0 || typeof prev.skills[0] === "string") {
          return {
            ...prev,
            skills: (prev.skills as string[]).filter((_, i) => i !== index),
          };
        }
      }
      return prev;
    });
  };

  // Categorized Skills Functions
  const addSkillCategory = () => {
    const newCat: SkillCategory = {
      id: Date.now().toString(),
      category: "",
      items: [],
    };
    setData((prev) => {
      const currentSkills = Array.isArray(prev.skills) ? prev.skills : [];
      let nextSkills: SkillCategory[] = [];
      if (currentSkills.length > 0 && typeof currentSkills[0] === "string") {
        nextSkills = [
          {
            id: "default-skills",
            category: "Skills",
            items: currentSkills as string[],
          },
        ];
      } else {
        nextSkills = currentSkills as SkillCategory[];
      }
      return {
        ...prev,
        skills: [...nextSkills, newCat],
      };
    });
  };

  const updateSkillCategory = (id: string, updates: Partial<SkillCategory>) => {
    setData((prev) => {
      const currentSkills = Array.isArray(prev.skills) ? prev.skills : [];
      let nextSkills: SkillCategory[] = [];
      if (currentSkills.length > 0 && typeof currentSkills[0] === "string") {
        nextSkills = [
          {
            id: "default-skills",
            category: "Skills",
            items: currentSkills as string[],
          },
        ];
      } else {
        nextSkills = currentSkills as SkillCategory[];
      }
      return {
        ...prev,
        skills: nextSkills.map((cat) =>
          cat.id === id ? { ...cat, ...updates } : cat,
        ),
      };
    });
  };

  const removeSkillCategory = (id: string) => {
    setData((prev) => {
      const currentSkills = Array.isArray(prev.skills) ? prev.skills : [];
      if (currentSkills.length > 0 && typeof currentSkills[0] === "string") {
        return { ...prev, skills: [] };
      }
      return {
        ...prev,
        skills: (currentSkills as SkillCategory[]).filter(
          (cat) => cat.id !== id,
        ),
      };
    });
  };

  const saveResume = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const savedResume = await saveMyResume({
        content: data,
      });
      setData(normalizeResumeData(savedResume.content));
      setSavedAt(savedResume.updatedAt);
    } catch {
      setSaveError("Unable to save your resume.");
    } finally {
      setIsSaving(false);
    }
  }, [data]);

  const exportResume = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    setExportError(null);

    try {
      const { blob, filename } = await exportResumePdf(data);
      downloadBlob(blob, filename);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Resume export failed.";
      setExportError(message);
    } finally {
      setIsExporting(false);
    }
  }, [data, isExporting]);

  return (
    <ResumeContext.Provider
      value={{
        data,
        updatePersonalInfo,
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
        addProject,
        updateProject,
        removeProject,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        updateSkill,
        removeSkill,
        addSkillCategory,
        updateSkillCategory,
        removeSkillCategory,
        isLoading,
        isSaving,
        isExporting,
        saveError,
        exportError,
        savedAt,
        saveResume,
        exportResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within ResumeProvider");
  }
  return context;
};
