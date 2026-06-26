"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiClientError } from "@/services";

import {
  fetchAdminAccounts,
  promoteAdminAccount,
  removeAdminAccess,
  updateAdminAccount,
} from "../api";
import type {
  AdminAccountsQuery,
  PromoteAdminBody,
  UpdateAdminBody,
} from "../types";
import { adminManagementKeys } from "./admin-query-keys";

export function useAdminAccounts(query: AdminAccountsQuery) {
  return useQuery({
    queryKey: adminManagementKeys.list(query),
    queryFn: () => fetchAdminAccounts(query),
  });
}

export function usePromoteAdminAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: PromoteAdminBody) => promoteAdminAccount(body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminManagementKeys.lists(),
      });
      toast.success("Admin access granted.");
    },
    onError: (error) => toast.error(getAdminMutationError(error)),
  });
}

export function useUpdateAdminAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      adminId,
      body,
    }: {
      adminId: string;
      body: UpdateAdminBody;
    }) => updateAdminAccount(adminId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminManagementKeys.lists(),
      });
      toast.success("Admin account updated.");
    },
    onError: (error) => toast.error(getAdminMutationError(error)),
  });
}

export function useRemoveAdminAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adminId: string) => removeAdminAccess(adminId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminManagementKeys.lists(),
      });
      toast.success("Admin access removed.");
    },
    onError: (error) => toast.error(getAdminMutationError(error)),
  });
}

const getAdminMutationError = (error: Error) =>
  error instanceof ApiClientError
    ? error.message
    : "Unable to update admin access.";
