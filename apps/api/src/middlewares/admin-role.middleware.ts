import type { NextFunction, Request, Response } from "express";

import { UnauthorizedException } from "@/common/exceptions";
import { prisma } from "@/lib/prisma";

import { type AdminRole, assertAdminAccess } from "./admin-role.policy";

export const adminRoleMiddleware =
  (allowedRoles: readonly AdminRole[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new UnauthorizedException();
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, role: true, status: true },
    });

    assertAdminAccess(user, allowedRoles);

    next();
  };
