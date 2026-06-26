import type {
  AdminCodingSubmissionsQuery,
  AdminInterviewsQuery,
  AdminUsersQuery,
} from "../types";

export const adminUsersKeys = {
  all: ["admin-users"] as const,
  lists: () => [...adminUsersKeys.all, "list"] as const,
  list: (query: AdminUsersQuery) => [...adminUsersKeys.lists(), query] as const,
  details: () => [...adminUsersKeys.all, "detail"] as const,
  detail: (userId: string) => [...adminUsersKeys.details(), userId] as const,
};

export const adminInterviewsKeys = {
  all: ["admin-interviews"] as const,
  lists: () => [...adminInterviewsKeys.all, "list"] as const,
  list: (query: AdminInterviewsQuery) =>
    [...adminInterviewsKeys.lists(), query] as const,
  details: () => [...adminInterviewsKeys.all, "detail"] as const,
  detail: (interviewId: string) =>
    [...adminInterviewsKeys.details(), interviewId] as const,
};

export const adminCodingKeys = {
  all: ["admin-coding"] as const,
  lists: () => [...adminCodingKeys.all, "list"] as const,
  list: (query: AdminCodingSubmissionsQuery) =>
    [...adminCodingKeys.lists(), query] as const,
  details: () => [...adminCodingKeys.all, "detail"] as const,
  detail: (submissionId: string) =>
    [...adminCodingKeys.details(), submissionId] as const,
};
