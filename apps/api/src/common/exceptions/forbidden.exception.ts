import { HttpStatus } from "../enums";
import { AbstractException } from "./abstract.exception";

export class ForbiddenException extends AbstractException {
  constructor(message = "Forbidden", details?: Record<string, unknown>) {
    super(message, HttpStatus.FORBIDDEN, "FORBIDDEN", details);
  }
}
