"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminInterviewDetails, fetchAdminInterviews } from "../api";
import type { AdminInterviewsQuery } from "../types";
import { adminInterviewsKeys } from "./admin-query-keys";

export function useAdminInterviews(query: AdminInterviewsQuery) {
  return useQuery({
    queryKey: adminInterviewsKeys.list(query),
    queryFn: () => fetchAdminInterviews(query),
  });
}

export function useAdminInterviewDetails(interviewId: string | null) {
  return useQuery({
    queryKey: interviewId
      ? adminInterviewsKeys.detail(interviewId)
      : [...adminInterviewsKeys.details(), "idle"],
    queryFn: () => fetchAdminInterviewDetails(interviewId ?? ""),
    enabled: interviewId !== null,
  });
}
