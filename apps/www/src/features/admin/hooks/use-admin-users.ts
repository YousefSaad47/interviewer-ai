"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ApiClientError } from "@/services";

import {
  fetchAdminUserDetails,
  fetchAdminUsers,
  updateAdminUserStatus,
} from "../api";
import type { AdminUserStatusBody, AdminUsersQuery } from "../types";
import { adminUsersKeys } from "./admin-query-keys";

export function useAdminUsers(query: AdminUsersQuery) {
  return useQuery({
    queryKey: adminUsersKeys.list(query),
    queryFn: () => fetchAdminUsers(query),
  });
}

export function useAdminUserDetails(userId: string | null) {
  return useQuery({
    queryKey: userId
      ? adminUsersKeys.detail(userId)
      : [...adminUsersKeys.details(), "idle"],
    queryFn: () => fetchAdminUserDetails(userId ?? ""),
    enabled: userId !== null,
  });
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      status,
      userId,
    }: {
      userId: string;
      status: AdminUserStatusBody["status"];
    }) => updateAdminUserStatus(userId, { status }),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: adminUsersKeys.lists() }),
        queryClient.invalidateQueries({
          queryKey: adminUsersKeys.detail(variables.userId),
        }),
      ]);

      toast.success("User status updated.");
    },
    onError: (error) => {
      const message =
        error instanceof ApiClientError
          ? error.message
          : "Failed to update user status.";

      toast.error(message);
    },
  });
}
