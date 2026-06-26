import type { ReactNode } from "react";

export type AdminSection =
  | "overview"
  | "users"
  | "interviews"
  | "coding"
  | "resumes"
  | "analytics"
  | "admins";

export type DrawerContent = {
  title: string;
  eyebrow: string;
  body: ReactNode;
};

export type AdminModalMode = "add" | "edit" | "delete";

export type AdminModalState = {
  mode: AdminModalMode;
  admin?: AdminAccount;
};

export type AdminStat = {
  label: string;
  value: string;
  change: string;
  caption: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  role: string;
  date: string;
  createdAt: string;
  interviews: number;
  coding: number;
  resumes: number;
  status: string;
  rawStatus: "ACTIVE" | "DISABLED";
  plan: string;
};

export type AdminInterview = {
  id: string;
  type: string;
  category: string;
  difficulty: string;
  candidate: string;
  candidateEmail: string;
  candidateImage: string | null;
  candidateId: string;
  date: string;
  startedAt: string;
  completedAt: string | null;
  duration: string;
  questionCount: number;
  answeredQuestionCount: number;
  currentQuestion: number;
  score: number | null;
  status: string;
  rawStatus: string;
};

export type AdminUserDetailsView = AdminUser & {
  updatedAt: string;
  lastLoginAt: string | null;
  lastLoginLabel: string;
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    status: string;
    createdAt: string;
    createdAtLabel: string;
  }>;
};

export type AdminInterviewDetailsView = AdminInterview & {
  scores: {
    communication: number | null;
    technical: number | null;
    confidence: number | null;
  };
  questions: Array<{
    id: string;
    sortOrder: number;
    text: string;
    category: string;
    difficulty: string;
    followUpText: string | null;
    answers: Array<{
      id: string;
      transcript: string | null;
      durationMs: number | null;
      createdAt: string;
      createdAtLabel: string;
      feedback: Array<{
        id: string;
        overallScore: number | null;
        idealAnswer: string | null;
        strengths: string[];
        improvements: string[];
        fillerWordCount: number | null;
        fluencyScore: number | null;
        clarityScore: number | null;
        confidenceScore: number | null;
        relevanceScore: number | null;
        technicalAccuracy: number | null;
        detailLevel: string | null;
        sentimentScore: number | null;
      }>;
    }>;
  }>;
};

export type AdminCodingSession = {
  problem: string;
  difficulty: string;
  language: string;
  status: string;
  submitted: string;
  score: number;
};

export type AdminCodingSubmission = {
  id: string;
  candidate: string;
  candidateEmail: string;
  candidateImage: string | null;
  candidateId: string;
  problem: string;
  problemId: string;
  difficulty: string;
  language: string;
  status: string;
  rawStatus: string;
  score: number | null;
  executionTimeMs: number | null;
  memoryUsedKb: number | null;
  date: string;
  createdAt: string;
};

export type AdminCodingSubmissionDetailsView = AdminCodingSubmission & {
  problemDescription: string;
  problemConstraints: string | null;
  code: string;
  scores: {
    logic: number | null;
    naming: number | null;
    efficiency: number | null;
    bestPractices: number | null;
  };
  aiFeedback: string | null;
  results: Array<{
    id: string;
    passed: boolean;
    output: string | null;
    error: string | null;
    testCase: {
      id: string;
      isHidden: boolean;
      sortOrder: number;
      input: string | undefined;
      output: string | undefined;
    };
  }>;
};

export type AdminResume = {
  id: string;
  candidate: string;
  candidateEmail: string;
  candidateImage: string | null;
  candidateId: string;
  title: string;
  score: number | null;
  grammarScore: number | null;
  suggestionsCount: number;
  matchesCount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  rawStatus: string;
  role: string;
};

export type AdminResumeDetailsView = AdminResume & {
  suggestions: string[];
  contentPreview: {
    fullName?: string;
    email?: string;
    phone?: string;
    location?: string;
    summary?: string;
    skills?: string[];
    experienceCount?: number;
    educationCount?: number;
  };
  matches: Array<{
    id: string;
    matchPct: number;
    jobTitle: string;
    company: string;
    matchedKeywords: string[];
    missingKeywords: string[];
  }>;
};

export type AdminAccount = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: boolean;
  role: string;
  rawRole: "ADMIN" | "SUPER_ADMIN";
  status: string;
  rawStatus: "ACTIVE" | "DISABLED";
  lastLogin: string;
  lastLoginAt: string | null;
  createdAt: string;
};

export type FeatureUsage = readonly [label: string, value: number];
