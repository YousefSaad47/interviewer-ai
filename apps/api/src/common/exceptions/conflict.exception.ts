import { HttpStatus } from "../enums";
import { AbstractException } from "./abstract.exception";

export class ConflictException extends AbstractException {
  constructor(
    message = "Resource already exists",
    details?: Record<string, unknown>,
  ) {
    super(message, HttpStatus.CONFLICT, "CONFLICT", details);
  }
}
