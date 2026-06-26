import { apiClient } from "@/services";

import type {
  AdminResumeDetailsDto,
  AdminResumesListResponse,
  AdminResumesQuery,
} from "../types";

const buildSearchParams = (query: AdminResumesQuery) => {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.userId) params.set("userId", query.userId);
  if (query.status) params.set("status", query.status);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  return params;
};

export const fetchAdminResumes = (query: AdminResumesQuery) => {
  const params = buildSearchParams(query);
  const suffix = params.size > 0 ? `?${params.toString()}` : "";

  return apiClient<AdminResumesListResponse>(`/api/admin/resumes${suffix}`);
};

export const fetchAdminResumeDetails = (resumeId: string) => {
  return apiClient<AdminResumeDetailsDto>(`/api/admin/resumes/${resumeId}`);
};
