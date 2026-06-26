export const INTERVIEW_QUESTION_COUNT = 5;

export const targetRoleOptions = [
  { value: "frontend", label: "Frontend Developer" },
  { value: "backend", label: "Backend Developer" },
  { value: "fullstack", label: "Full Stack Developer" },
  { value: "mobile", label: "Mobile Developer" },
  { value: "devops", label: "DevOps Engineer" },
  { value: "data", label: "Data Scientist" },
  { value: "ml", label: "ML Engineer" },
] as const;

export const experienceLevelOptions = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (2-5 years)" },
  { value: "senior", label: "Senior (5-8 years)" },
  { value: "lead", label: "Lead (8+ years)" },
  { value: "staff", label: "Staff/Principal" },
] as const;

export const interviewFocusOptions = [
  { value: "algorithms", label: "Algorithms & Data Structures" },
  { value: "system-design", label: "System Design" },
  { value: "behavioral", label: "Behavioral Questions" },
  { value: "coding", label: "Coding Challenges" },
  { value: "architecture", label: "Architecture & Patterns" },
  { value: "debugging", label: "Debugging & Problem Solving" },
] as const;
