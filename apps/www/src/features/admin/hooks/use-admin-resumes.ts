"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminResumeDetails, fetchAdminResumes } from "../api";
import type { AdminResumesQuery } from "../types";
import { adminResumesKeys } from "./admin-query-keys";

export function useAdminResumes(query: AdminResumesQuery) {
  return useQuery({
    queryKey: adminResumesKeys.list(query),
    queryFn: () => fetchAdminResumes(query),
  });
}

export function useAdminResumeDetails(resumeId: string | null) {
  return useQuery({
    queryKey: resumeId
      ? adminResumesKeys.detail(resumeId)
      : [...adminResumesKeys.details(), "idle"],
    queryFn: () => fetchAdminResumeDetails(resumeId ?? ""),
    enabled: resumeId !== null,
  });
}
