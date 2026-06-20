import { HttpStatus } from "../enums";
import { AbstractException } from "./abstract.exception";

export class InternalException extends AbstractException {
  constructor(
    message = "Internal server error",
    details?: Record<string, unknown>,
  ) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", details);
  }
}
