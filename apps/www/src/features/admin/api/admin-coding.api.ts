import { apiClient } from "@/services";

import type {
  AdminCodingProblemCreatedDto,
  AdminCodingSubmissionDetailsDto,
  AdminCodingSubmissionsListResponse,
  AdminCodingSubmissionsQuery,
  CreateAdminCodingProblemBody,
} from "../types";

const buildSearchParams = (query: AdminCodingSubmissionsQuery) => {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.userId) params.set("userId", query.userId);
  if (query.problemId) params.set("problemId", query.problemId);
  if (query.status) params.set("status", query.status);
  if (query.language) params.set("language", query.language);
  if (query.difficulty) params.set("difficulty", query.difficulty);
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  return params;
};

export const fetchAdminCodingSubmissions = (
  query: AdminCodingSubmissionsQuery,
) => {
  const params = buildSearchParams(query);
  const suffix = params.size > 0 ? `?${params.toString()}` : "";

  return apiClient<AdminCodingSubmissionsListResponse>(
    `/api/admin/coding/submissions${suffix}`,
  );
};

export const fetchAdminCodingSubmissionDetails = (submissionId: string) => {
  return apiClient<AdminCodingSubmissionDetailsDto>(
    `/api/admin/coding/submissions/${submissionId}`,
  );
};

export const createAdminCodingProblem = (
  body: CreateAdminCodingProblemBody,
) => {
  return apiClient<AdminCodingProblemCreatedDto>("/api/admin/coding/problems", {
    method: "POST",
    json: body,
  });
};
