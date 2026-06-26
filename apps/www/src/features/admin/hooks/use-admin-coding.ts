"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiClientError } from "@/services";

import {
  createAdminCodingProblem,
  fetchAdminCodingSubmissionDetails,
  fetchAdminCodingSubmissions,
} from "../api";
import type {
  AdminCodingSubmissionsQuery,
  CreateAdminCodingProblemBody,
} from "../types";
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

export function useCreateAdminCodingProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateAdminCodingProblemBody) =>
      createAdminCodingProblem(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminCodingKeys.lists(),
      });
      toast.success("Coding problem created.");
    },
    onError: (error) => toast.error(getAdminCodingMutationError(error)),
  });
}

const getAdminCodingMutationError = (error: Error) =>
  error instanceof ApiClientError
    ? error.message
    : "Unable to create coding problem.";
