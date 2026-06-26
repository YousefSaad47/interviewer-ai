import { apiClient } from "@/services";

import type {
  AdminAccountMutationResponse,
  AdminAccountsListResponse,
  AdminAccountsQuery,
  PromoteAdminBody,
  RemoveAdminAccessResponse,
  UpdateAdminBody,
} from "../types";

const buildSearchParams = (query: AdminAccountsQuery) => {
  const params = new URLSearchParams();

  if (query.search) params.set("search", query.search);
  if (query.status) params.set("status", query.status);
  if (query.role) params.set("role", query.role);
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));

  return params;
};

export const fetchAdminAccounts = (query: AdminAccountsQuery) => {
  const params = buildSearchParams(query);
  const suffix = params.size > 0 ? `?${params.toString()}` : "";

  return apiClient<AdminAccountsListResponse>(`/api/admin/admins${suffix}`);
};

export const promoteAdminAccount = (body: PromoteAdminBody) => {
  return apiClient<AdminAccountMutationResponse>("/api/admin/admins", {
    method: "POST",
    json: body,
  });
};

export const updateAdminAccount = (adminId: string, body: UpdateAdminBody) => {
  return apiClient<AdminAccountMutationResponse>(
    `/api/admin/admins/${adminId}`,
    {
      method: "PATCH",
      json: body,
    },
  );
};

export const removeAdminAccess = (adminId: string) => {
  return apiClient<RemoveAdminAccessResponse>(`/api/admin/admins/${adminId}`, {
    method: "DELETE",
  });
};
