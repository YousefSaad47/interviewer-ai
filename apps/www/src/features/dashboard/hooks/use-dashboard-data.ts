import {
  useGetApiDashboardGoals,
  useGetApiDashboardRecent,
  useGetApiDashboardSkills,
  useGetApiDashboardStats,
} from "@repo/kubb";

export const useDashboardStats = useGetApiDashboardStats;
export const useDashboardRecent = useGetApiDashboardRecent;
export const useDashboardSkills = useGetApiDashboardSkills;
export const useDashboardGoals = useGetApiDashboardGoals;
