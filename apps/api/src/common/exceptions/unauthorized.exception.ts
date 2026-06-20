import { HttpStatus } from "../enums";
import { AbstractException } from "./abstract.exception";

export class UnauthorizedException extends AbstractException {
  constructor(message = "Unauthorized", details?: Record<string, unknown>) {
    super(message, HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", details);
  }
}
