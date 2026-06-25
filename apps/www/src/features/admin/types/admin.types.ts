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

export type AdminStat = {
  label: string;
  value: string;
  change: string;
  caption: string;
};

export type AdminUser = {
  name: string;
  email: string;
  date: string;
  interviews: number;
  coding: number;
  resumes: number;
  status: string;
  plan: string;
};

export type AdminInterview = {
  type: string;
  candidate: string;
  date: string;
  duration: string;
  score: number;
  status: string;
};

export type AdminCodingSession = {
  problem: string;
  difficulty: string;
  language: string;
  status: string;
  submitted: string;
  score: number;
};

export type AdminResume = {
  candidate: string;
  score: number;
  date: string;
  status: string;
  role: string;
};

export type AdminAccount = {
  name: string;
  role: string;
  email: string;
  status: string;
  lastLogin: string;
};

export type FeatureUsage = readonly [label: string, value: number];
