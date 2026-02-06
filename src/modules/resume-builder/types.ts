export type PersonalInfo = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
};

export type WorkExperience = {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  year: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
};
