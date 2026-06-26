import { ForbiddenException, UnauthorizedException } from "@/common/exceptions";
import type { UserRole, UserStatus } from "@/generated/enums";

export type AdminRole = Extract<UserRole, "ADMIN" | "SUPER_ADMIN">;

type AdminAccessUser = {
  role: UserRole;
  status: UserStatus;
} | null;

export const assertAdminAccess = (
  user: AdminAccessUser,
  allowedRoles: readonly AdminRole[],
) => {
  if (!user) {
    throw new UnauthorizedException("Authenticated account no longer exists");
  }

  if (user.status !== "ACTIVE") {
    throw new ForbiddenException("Account is disabled");
  }

  if (!allowedRoles.some((allowedRole) => allowedRole === user.role)) {
    throw new ForbiddenException("Admin role required");
  }
};
