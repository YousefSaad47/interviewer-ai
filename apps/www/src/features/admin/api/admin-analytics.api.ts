import { apiClient } from "@/services";

import type { AdminAnalyticsQuery, AdminAnalyticsResponse } from "../types";

const buildSearchParams = (query: AdminAnalyticsQuery) => {
  const params = new URLSearchParams();

  if (query.range) params.set("range", query.range);
  if (query.interval) params.set("interval", query.interval);

  return params;
};

export const fetchAdminAnalytics = (query: AdminAnalyticsQuery) => {
  const params = buildSearchParams(query);
  const suffix = params.size > 0 ? `?${params.toString()}` : "";

  return apiClient<AdminAnalyticsResponse>(`/api/admin/analytics${suffix}`);
};
