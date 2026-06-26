"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminAnalytics } from "../api";
import type { AdminAnalyticsQuery } from "../types";
import { adminAnalyticsKeys } from "./admin-query-keys";

export function useAdminAnalytics(query: AdminAnalyticsQuery = {}) {
  return useQuery({
    queryKey: adminAnalyticsKeys.detail(query),
    queryFn: () => fetchAdminAnalytics(query),
  });
}
