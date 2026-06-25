import { ForbiddenException } from "@/common/exceptions";
import type { UserRole, UserStatus } from "@/generated/enums";

export type AdminUserStatusTarget = {
  id: string;
  role: UserRole;
  status: UserStatus;
};

export const assertCanChangeAdminUserStatus = (
  currentUserId: string,
  targetUser: AdminUserStatusTarget,
  nextStatus: UserStatus,
) => {
  if (targetUser.status === nextStatus) {
    return;
  }

  if (nextStatus === "DISABLED" && targetUser.id === currentUserId) {
    throw new ForbiddenException("Super admins cannot disable themselves");
  }

  if (nextStatus === "DISABLED" && targetUser.role === "SUPER_ADMIN") {
    throw new ForbiddenException(
      "Super admins cannot disable other super admins",
    );
  }
};
