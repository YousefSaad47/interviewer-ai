/** biome-ignore-all lint/complexity/noStaticOnlyClass: mapper namespace follows the module's OOP style */

import { InternalException } from "@/common/exceptions";
import type { UserRole } from "@/generated/enums";

import type {
  AdminAccountListRecord,
  AdminAccountMutationRecord,
} from "./admin-management.repository";
import type {
  AdminAccountListItem,
  AdminAccountMutationResponse,
} from "./admin-management.schema";

export class AdminManagementMapper {
  public static toListItem(
    admin: AdminAccountListRecord,
  ): AdminAccountListItem {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      image: admin.image,
      emailVerified: admin.emailVerified,
      role: toAdminRole(admin.role),
      status: admin.status,
      createdAt: admin.createdAt.toISOString(),
      lastLoginAt: admin.sessions[0]?.updatedAt.toISOString() ?? null,
    };
  }

  public static toMutationResponse(
    admin: AdminAccountMutationRecord,
  ): AdminAccountMutationResponse {
    return {
      id: admin.id,
      role: toAdminRole(admin.role),
      status: admin.status,
    };
  }
}

const toAdminRole = (role: UserRole): "ADMIN" | "SUPER_ADMIN" => {
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    return role;
  }

  throw new InternalException("Expected admin role");
};
