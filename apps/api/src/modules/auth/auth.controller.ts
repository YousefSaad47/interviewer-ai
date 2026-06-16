import type { RequestHandler } from "express";

import { AbstractController } from "@/common/contracts";
import { HttpStatus } from "@/common/enums";
import { registerPath } from "@/lib/openapi/registry";
import { validationMiddleware } from "@/middlewares";

import { type SignInBody, signInSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

export class AuthController extends AbstractController<AuthService> {
  public override path = "auth";

  protected _registerRoutes() {
    this._registerOpenAPI();
    this._router.post(
      "/signin",
      validationMiddleware({ body: signInSchema }),
      this._login,
    );
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Auth"],
      method: "post",
      path: "/api/auth/signin",
      summary: "Sign in",
      bodySchema: signInSchema,
      statusCode: HttpStatus.OK,
      responseDescription: "Sign-in successful",
    });
  }

  private _login: RequestHandler<unknown, unknown, SignInBody> = (req, res) => {
    const { email, password } = req.body;
    this._service._login({ email, password });
    res.status(HttpStatus.OK).json({ message: "Login successful" });
  };
}
