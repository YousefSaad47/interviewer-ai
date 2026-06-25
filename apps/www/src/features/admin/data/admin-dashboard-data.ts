import {
  BarChart3,
  BriefcaseBusiness,
  Code2,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  Users,
} from "lucide-react";

import type {
  AdminAccount,
  AdminCodingSession,
  AdminInterview,
  AdminResume,
  AdminSection,
  AdminStat,
  AdminUser,
  FeatureUsage,
} from "../types";

export const adminSections = [
  {
    id: "overview",
    label: "Dashboard",
    icon: LayoutDashboard,
    title: "Command center",
  },
  { id: "users", label: "Users", icon: Users, title: "Users" },
  {
    id: "interviews",
    label: "Mock Interviews",
    icon: BriefcaseBusiness,
    title: "Mock interviews",
  },
  {
    id: "coding",
    label: "Coding Practice",
    icon: Code2,
    title: "Coding practice",
  },
  {
    id: "resumes",
    label: "Resume Builder",
    icon: FileText,
    title: "Resume builder",
  },
  { id: "analytics", label: "Analytics", icon: BarChart3, title: "Analytics" },
  {
    id: "admins",
    label: "Admin Management",
    icon: ShieldCheck,
    title: "Admin management",
  },
] satisfies Array<{
  id: AdminSection;
  label: string;
  icon: typeof LayoutDashboard;
  title: string;
}>;

export const adminStats: AdminStat[] = [
  {
    label: "Total Users",
    value: "24,892",
    change: "+12.8%",
    caption: "1,204 active today",
  },
  {
    label: "Mock Interviews",
    value: "8,641",
    change: "+18.4%",
    caption: "412 completed this week",
  },
  {
    label: "Coding Sessions",
    value: "15,390",
    change: "+9.6%",
    caption: "72% pass-rate trend",
  },
  {
    label: "Resume Analyses",
    value: "6,218",
    change: "+7.1%",
    caption: "1,876 ATS checks",
  },
];

export const adminUsers: AdminUser[] = [
  {
    name: "Maya Hassan",
    email: "maya.hassan@example.com",
    date: "Jun 24, 2026",
    interviews: 18,
    coding: 42,
    resumes: 4,
    status: "Active",
    plan: "Pro",
  },
  {
    name: "Jon Bell",
    email: "jon.bell@example.com",
    date: "Jun 23, 2026",
    interviews: 6,
    coding: 13,
    resumes: 2,
    status: "Trial",
    plan: "Starter",
  },
  {
    name: "Rana Fouad",
    email: "rana.fouad@example.com",
    date: "Jun 21, 2026",
    interviews: 27,
    coding: 68,
    resumes: 7,
    status: "Active",
    plan: "Team",
  },
  {
    name: "Samir Cole",
    email: "samir.cole@example.com",
    date: "Jun 19, 2026",
    interviews: 2,
    coding: 9,
    resumes: 1,
    status: "Disabled",
    plan: "Starter",
  },
  {
    name: "Lina Park",
    email: "lina.park@example.com",
    date: "Jun 18, 2026",
    interviews: 11,
    coding: 24,
    resumes: 3,
    status: "Active",
    plan: "Pro",
  },
];

export const adminInterviews: AdminInterview[] = [
  {
    type: "System design",
    candidate: "Maya Hassan",
    date: "Jun 25, 2026",
    duration: "42m",
    score: 88,
    status: "Reviewed",
  },
  {
    type: "Behavioral",
    candidate: "Jon Bell",
    date: "Jun 25, 2026",
    duration: "28m",
    score: 74,
    status: "Processing",
  },
  {
    type: "Frontend",
    candidate: "Rana Fouad",
    date: "Jun 24, 2026",
    duration: "51m",
    score: 91,
    status: "Reviewed",
  },
  {
    type: "Data structures",
    candidate: "Lina Park",
    date: "Jun 24, 2026",
    duration: "36m",
    score: 82,
    status: "Flagged",
  },
];

export const adminCodingSessions: AdminCodingSession[] = [
  {
    problem: "Merge Intervals",
    difficulty: "Medium",
    language: "TypeScript",
    status: "Accepted",
    submitted: "11:42 AM",
    score: 94,
  },
  {
    problem: "LRU Cache",
    difficulty: "Hard",
    language: "Python",
    status: "Runtime Error",
    submitted: "10:16 AM",
    score: 52,
  },
  {
    problem: "Valid Parentheses",
    difficulty: "Easy",
    language: "JavaScript",
    status: "Accepted",
    submitted: "Yesterday",
    score: 100,
  },
  {
    problem: "Top K Frequent",
    difficulty: "Medium",
    language: "Go",
    status: "Partial",
    submitted: "Yesterday",
    score: 78,
  },
];

export const adminResumes: AdminResume[] = [
  {
    candidate: "Rana Fouad",
    score: 92,
    date: "Jun 25, 2026",
    status: "Completed",
    role: "Product Engineer",
  },
  {
    candidate: "Maya Hassan",
    score: 86,
    date: "Jun 24, 2026",
    status: "Completed",
    role: "Senior Frontend Engineer",
  },
  {
    candidate: "Jon Bell",
    score: 71,
    date: "Jun 23, 2026",
    status: "Needs edits",
    role: "Backend Engineer",
  },
  {
    candidate: "Lina Park",
    score: 89,
    date: "Jun 22, 2026",
    status: "Completed",
    role: "UX Engineer",
  },
];

export const adminAccounts: AdminAccount[] = [
  {
    name: "Karim Amin",
    role: "Super Admin",
    email: "karim@interviewer.ai",
    status: "Active",
    lastLogin: "Today, 12:04 PM",
  },
  {
    name: "Nora Samy",
    role: "Admin",
    email: "nora@interviewer.ai",
    status: "Active",
    lastLogin: "Yesterday, 7:18 PM",
  },
  {
    name: "Theo Grant",
    role: "Moderator",
    email: "theo@interviewer.ai",
    status: "Invited",
    lastLogin: "Not yet",
  },
];

export const adminActivity = [
  "Rana completed a Frontend mock interview with a 91% AI score.",
  "Maya exported an ATS-optimized resume for Senior Frontend Engineer.",
  "Jon triggered three failed LRU Cache submissions.",
  "Nora invited Theo as a Moderator.",
];

export const adminChartSeries = [
  42, 54, 49, 67, 72, 86, 92, 108, 118, 132, 147, 164,
];

export const adminFeatureUsage: FeatureUsage[] = [
  ["Mock interviews", 92],
  ["Coding practice", 78],
  ["Resume scans", 64],
  ["Profile settings", 38],
];
