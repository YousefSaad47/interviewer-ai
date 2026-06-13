import type { RequestHandler } from "express";

import { ServicesFactory } from "@/common";
import { AbstractController } from "@/common/contracts";
import { HttpStatus, Services } from "@/common/enums";
import { validationMiddleware } from "@/middlewares";

import { type SignInBody, signInSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

export class AuthController extends AbstractController<AuthService> {
  public path = "auth";

  constructor() {
    super(ServicesFactory.create(Services.AUTH) as AuthService);
  }

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
