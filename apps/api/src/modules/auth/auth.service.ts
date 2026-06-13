import { AbstractService } from "@/common/contracts";

import { SignInBody } from "./auth.schema";

export class AuthService extends AbstractService {
  public async _login({ email, password }: SignInBody) {
    console.log({ email, password });
  }
}
