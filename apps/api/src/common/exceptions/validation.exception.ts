import { HttpStatus } from "../enums";
import { AbstractException } from "./abstract.exception";

type ValidationExceptionOptions = {
  details: Record<string, unknown>;
};

export class ValidationException extends AbstractException {
  constructor(message: string, _options?: ValidationExceptionOptions) {
    super(
      message,
      HttpStatus.BAD_REQUEST,
      "VALIDATION_ERROR",
      _options?.details,
    );
  }
}
