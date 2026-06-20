import { HttpStatus } from "../enums";
import { AbstractException } from "./abstract.exception";

export class BadRequestException extends AbstractException {
  constructor(message = "Bad request", details?: Record<string, unknown>) {
    super(message, HttpStatus.BAD_REQUEST, "BAD_REQUEST", details);
  }
}
