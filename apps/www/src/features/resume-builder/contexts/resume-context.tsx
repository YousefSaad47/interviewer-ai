"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import type {
  Education,
  PersonalInfo,
  ResumeData,
  WorkExperience,
} from "../types";

interface ResumeContextType {
  data: ResumeData;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addWorkExperience: () => void;
  updateWorkExperience: (id: string, updates: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: string) => void;
  updateSkill: (index: number, skill: string) => void;
  removeSkill: (index: number) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const initialData: ResumeData = {
  personalInfo: {
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary:
      "Experienced software engineer with 5+ years building scalable web applications.",
  },
  workExperience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      duration: "2022 - Present",
      description: "Description of responsibilities and achievements",
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
  skills: ["React", "TypeScript", "Node.js", "Python"],
};

export const ResumeProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<ResumeData>(initialData);

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

  return (
    <ResumeContext.Provider
      value={{
        data,
        updatePersonalInfo,
        addWorkExperience,
        updateWorkExperience,
        removeWorkExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addSkill,
        updateSkill,
        removeSkill,
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
