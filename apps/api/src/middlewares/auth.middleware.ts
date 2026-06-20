import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

import { UnauthorizedException } from "@/common/exceptions";
import { auth } from "@/lib/auth";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    throw new UnauthorizedException();
  }

  req.userId = session.user.id;
  next();
};
