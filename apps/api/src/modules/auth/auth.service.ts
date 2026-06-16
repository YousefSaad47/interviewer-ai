import { AbstractService } from "@/common/contracts";
import { logger } from "@/lib/logger";

import type { SignInBody } from "./auth.schema";

export class AuthService extends AbstractService {
  public async _login({ email }: SignInBody) {
    logger.info({ email }, "Login attempt");
  }
}
