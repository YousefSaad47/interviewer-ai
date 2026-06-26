import { apiClient } from "@/services";

import type {
  AdminUserDetailsDto,
  AdminUserStatusBody,
  AdminUserStatusResponse,
  AdminUsersListResponse,
  AdminUsersQuery,
} from "../types";

const buildSearchParams = (query: AdminUsersQuery) => {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.role) params.set("role", query.role);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  return params;
};

export const fetchAdminUsers = (query: AdminUsersQuery) => {
  const params = buildSearchParams(query);
  const suffix = params.size > 0 ? `?${params.toString()}` : "";

  return apiClient<AdminUsersListResponse>(`/api/admin/users${suffix}`);
};

export const fetchAdminUserDetails = (userId: string) => {
  return apiClient<AdminUserDetailsDto>(`/api/admin/users/${userId}`);
};

export const updateAdminUserStatus = (
  userId: string,
  body: AdminUserStatusBody,
) => {
  return apiClient<AdminUserStatusResponse>(
    `/api/admin/users/${userId}/status`,
    {
      method: "PATCH",
      json: body,
    },
  );
};
