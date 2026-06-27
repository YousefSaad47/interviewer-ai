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
  SkillCategory,
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
  saveError: string | null;
  savedAt: string | null;
  saveResume: () => Promise<void>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

const initialData: ResumeData = {
  personalInfo: {
    fullName: "Mohamed Abdel Kareem",
    email: "mohamedabdelkreem770@gmail.com",
    phone: "+201016493339",
    location: "Cairo, Egypt",
    summary:
      "Backend-focused Software Engineer specializing in secure, scalable RESTful APIs and production-grade authentication systems using Node.js, TypeScript, and PostgreSQL. Experienced in relational database modeling, cloud integrations, and API security hardening. Delivers complete solutions with React on the frontend. Proven problem solver — 2× ECPC Finalist and competitive programming coach to 150+ students.",
    linkedin: "linkedin.com/in/mohamed-abdel-kareem-08a550216",
    github: "github.com/Mohamd-Abdelkreem",
  },
  workExperience: [],
  projects: [
    {
      id: "p-1",
      name: "Event Ticket Booking System",
      role: "",
      duration: "",
      description:
        "Backend ticketing platform (Node.js, Express, TypeScript, Prisma, PostgreSQL) where organizers manage events and users book, pay via Stripe, and receive QR-coded tickets. Features atomic booking transactions, auto-refunds on cancellation, gate validation, JWT rotation, TOTP 2FA, Google/GitHub OAuth, AWS S3 uploads, rate limiting, and audit logging.",
      url: "https://github.com/Mohamd-Abdelkreem",
    },
    {
      id: "p-2",
      name: "Social Media REST API",
      role: "",
      duration: "",
      description:
        "Backend platform (Node.js, Express, TypeScript, Prisma, PostgreSQL) where users create posts, follow/block others, send friend requests, and browse a personalized feed. Secured with JWT refresh rotation, TOTP 2FA, Google OAuth, AWS S3, rate limiting, and parameterized queries.",
      url: "https://github.com/Mohamd-Abdelkreem",
    },
    {
      id: "p-3",
      name: "Anonymous Messaging Backend (Saraha)",
      role: "",
      duration: "",
      description:
        "Anonymous messaging platform (Node.js, Express, MongoDB) where users share a profile link to receive messages without revealing sender identity. Features JWT auth, OTP email verification, Google OAuth 2.0, Cloudinary uploads, and modular MVC architecture.",
      url: "https://github.com/Mohamd-Abdelkreem",
    },
    {
      id: "p-4",
      name: "News & Blog Platform",
      role: "",
      duration: "",
      description:
        "React SPA where users browse real-time news, check live weather, and publish personal blog posts with full CRUD. Integrated multiple third-party REST APIs with responsive UI and efficient state management.",
      url: "https://github.com/Mohamd-Abdelkreem",
    },
    {
      id: "p-5",
      name: "Cryptocurrency Price Tracker",
      role: "",
      duration: "",
      description:
        "React dashboard where users track real-time crypto prices, visualize historical trends via interactive charts, and convert between currencies using CoinGecko API with client-side data caching.",
      url: "https://github.com/Mohamd-Abdelkreem",
    },
    {
      id: "p-6",
      name: "Movie Search & Discovery",
      role: "",
      duration: "",
      description:
        "React app where users search, filter, and discover trending movies powered by TMDb REST API, built with Tailwind CSS for responsive mobile-first design with real-time search and pagination.",
      url: "https://github.com/Mohamd-Abdelkreem",
    },
  ],
  education: [
    {
      id: "e-1",
      school: "Higher Technological Institute",
      degree: "BS in Computer Science – 10th of Ramadan City, Egypt",
      year: "2022 – 2026 (Expected)",
    },
    {
      id: "e-2",
      school: "Route Academy",
      degree: "Node.js Development Course",
      year: "2025 (Completed)",
    },
  ],
  skills: [
    {
      id: "s-1",
      category: "Backend",
      items: [
        "Node.js",
        "Express.js",
        "TypeScript",
        "RESTful API Design",
        "JWT & OAuth Authentication",
        "PostgreSQL",
        "MongoDB",
        "Prisma ORM",
        "Security (Helmet, CORS, rate-limiting, input validation)",
      ],
    },
    {
      id: "s-2",
      category: "Frontend",
      items: [
        "React",
        "JavaScript (ES6+)",
        "HTML5",
        "CSS3",
        "Tailwind CSS",
        "Responsive Design",
      ],
    },
    {
      id: "s-3",
      category: "Core CS",
      items: [
        "Data Structures",
        "Algorithms",
        "OOP",
        "Database Design",
        "C++ (Advanced/ICPC-level)",
      ],
    },
    {
      id: "s-4",
      category: "DevOps & Tools",
      items: [
        "Git/GitHub",
        "VS Code",
        "Postman",
        "AWS S3",
        "Docker",
        "Command Line",
        "npm",
      ],
    },
  ],
};

const normalizeResumeData = (content: any): ResumeData => {
  const normalized = { ...content };
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
        items: normalized.skills,
      },
    ];
  }
  return normalized as ResumeData;
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
        skills: (currentSkills as SkillCategory[]).filter((cat) => cat.id !== id),
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
