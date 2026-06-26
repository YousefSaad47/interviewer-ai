import { apiClient } from "@/services";

import type {
  AdminInterviewDetailsDto,
  AdminInterviewsListResponse,
  AdminInterviewsQuery,
} from "../types";

const buildSearchParams = (query: AdminInterviewsQuery) => {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.userId) params.set("userId", query.userId);
  if (query.status) params.set("status", query.status);
  if (query.category) params.set("category", query.category);
  if (query.difficulty) params.set("difficulty", query.difficulty);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  return params;
};

export const fetchAdminInterviews = (query: AdminInterviewsQuery) => {
  const params = buildSearchParams(query);
  const suffix = params.size > 0 ? `?${params.toString()}` : "";

  return apiClient<AdminInterviewsListResponse>(
    `/api/admin/interviews${suffix}`,
  );
};

export const fetchAdminInterviewDetails = (interviewId: string) => {
  return apiClient<AdminInterviewDetailsDto>(
    `/api/admin/interviews/${interviewId}`,
  );
};
