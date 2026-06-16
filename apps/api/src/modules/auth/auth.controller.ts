import type { RequestHandler } from "express";

import { AbstractController } from "@/common/contracts";
import { HttpStatus } from "@/common/enums";
import { validationMiddleware } from "@/middlewares";

import { type SignInBody, signInSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

export class AuthController extends AbstractController<AuthService> {
  public override path = "auth";

  protected _registerRoutes() {
    this._router.post(
      "/signin",
      validationMiddleware({ body: signInSchema }),
      this._login,
    );
  }

  private _login: RequestHandler<unknown, unknown, SignInBody> = (req, res) => {
    const { email, password } = req.body;
    this._service._login({ email, password });
    res.status(HttpStatus.OK).json({ message: "Login successful" });
  };
}
