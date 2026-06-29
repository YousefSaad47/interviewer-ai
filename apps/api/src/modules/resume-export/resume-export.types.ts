export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin?: string;
  github?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface Project {
  id: string;
  name: string;
  role: string;
  duration: string;
  description: string;
  url?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface ResumeContent {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  projects: Project[];
  education: Education[];
  skills: string[] | SkillCategory[];
}

export interface NormalizedSkillCategory {
  category: string;
  items: string[];
}

export interface NormalizedResume {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  projects: Project[];
  education: Education[];
  skills: NormalizedSkillCategory[];
}

export interface OptimizedResume {
  personalInfo: PersonalInfo;
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
    url?: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    year: string;
  }>;
  skills: Array<{
    category: string;
    items: string[];
  }>;
  summary: string;
}
