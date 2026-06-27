"use client";

import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { getMyResume, saveMyResume } from "../api";
import type {
  Education,
  PersonalInfo,
  Project,
  ResumeData,
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
  isLoading: boolean;
  isSaving: boolean;
  saveError: string | null;
  savedAt: string | null;
  saveResume: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const initialData: ResumeData = {
  personalInfo: {
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+201016493339",
    location: "Egypt",
    summary:
      "Senior Full Stack Engineer with 5+ years of experience building scalable web applications and distributed architectures. Proficient in React, TypeScript, Node.js, and cloud platforms, with a focus on performance optimization and responsive user interfaces.",
  },
  workExperience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      duration: "2022 - Present",
      description:
        "Led the frontend migration to Next.js, resulting in a 40% improvement in page load speeds. Spearheaded the design of reusable UI component libraries used across multiple product teams. Mentored junior developers and established CI/CD pipelines using GitHub Actions.",
    },
    {
      id: "2",
      company: "DevSolutions Ltd",
      position: "Software Engineer",
      duration: "2020 - 2022",
      description:
        "Developed and maintained responsive e-commerce web applications using React, Redux, and Node.js. Optimized PostgreSQL database queries to reduce API latency by 30%. Implemented secure payment gateway integrations.",
    },
  ],
  projects: [
    {
      id: "1",
      name: "AI-Powered Interview Prep Platform",
      role: "Full Stack Developer",
      duration: "2024",
      description:
        "Built an interactive mock interview web application utilizing Gemini AI for speech-to-text and performance evaluation. Designed responsive dashboard analytics using Next.js and Prisma, providing users with actionable feedback.",
    },
    {
      id: "2",
      name: "Real-time Collaboration Canvas",
      role: "Creator",
      duration: "2023",
      description:
        "Created a collaborative whiteboarding tool using React, HTML5 Canvas, and WebSockets. Achieved sub-50ms sync latency for concurrent users and integrated local persistence using IndexedDB.",
    },
  ],
  education: [
    {
      id: "1",
      school: "University of California",
      degree: "B.S. Computer Science",
      year: "2018",
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "Python",
    "Next.js",
    "PostgreSQL",
    "Tailwind CSS",
    "Docker",
    "Git",
  ],
};

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ResumeData>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
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
          setData(resume.content);
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

  const addSkill = (skill: string) => {
    if (skill.trim()) {
      setData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }));
    }
  };

  const updateSkill = (index: number, skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((s, i) => (i === index ? skill : s)),
    }));
  };

  const removeSkill = (index: number) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const saveResume = useCallback(async () => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const savedResume = await saveMyResume({
        content: data,
      });
      setData(savedResume.content);
      setSavedAt(savedResume.updatedAt);
    } catch {
      setSaveError("Unable to save your resume.");
    } finally {
      setIsSaving(false);
    }
  }, [data]);

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
        isLoading,
        isSaving,
        saveError,
        savedAt,
        saveResume,
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
