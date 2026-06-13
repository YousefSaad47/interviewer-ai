import chalk from "chalk";

import { HttpStatus } from "../enums";
import {
  AbstractException,
  type SerializedException,
} from "./abstract.exception";

export class ValidationException extends AbstractException {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, HttpStatus.BAD_REQUEST, "VALIDATION_ERROR", details);
  }

  public serialize(): SerializedException {
    console.warn(chalk.yellow(`${this.name}: ${this.message}`));
    return {
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this._details,
    };
  }
}
