import { HttpStatus } from "../enums";
import { AbstractException } from "./abstract.exception";

export class NotFoundException extends AbstractException {
  constructor(
    message = "Resource not found",
    details?: Record<string, unknown>,
  ) {
    super(message, HttpStatus.NOT_FOUND, "NOT_FOUND", details);
  }
}
