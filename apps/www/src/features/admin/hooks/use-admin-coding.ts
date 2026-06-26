"use client";

import { useQuery } from "@tanstack/react-query";

import {
  fetchAdminCodingSubmissionDetails,
  fetchAdminCodingSubmissions,
} from "../api";
import type { AdminCodingSubmissionsQuery } from "../types";
import { adminCodingKeys } from "./admin-query-keys";

export function useAdminCodingSubmissions(query: AdminCodingSubmissionsQuery) {
  return useQuery({
    queryKey: adminCodingKeys.list(query),
    queryFn: () => fetchAdminCodingSubmissions(query),
  });
}

export function useAdminCodingSubmissionDetails(submissionId: string | null) {
  return useQuery({
    queryKey: submissionId
      ? adminCodingKeys.detail(submissionId)
      : [...adminCodingKeys.details(), "idle"],
    queryFn: () => fetchAdminCodingSubmissionDetails(submissionId ?? ""),
    enabled: submissionId !== null,
  });
}
