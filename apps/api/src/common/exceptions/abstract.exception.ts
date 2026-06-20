import { logger } from "@/lib/logger";

export type SerializedException = {
  message: string;
  statusCode: number;
  code: string;
  details?: Record<string, unknown>;
} & Record<string, unknown>;

export abstract class AbstractException extends Error {
  constructor(
    message: string,
    protected readonly _statusCode: number,
    protected readonly _code: string,
    protected readonly _details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }

  public serialize(): SerializedException {
    if (!this.isOperational) {
      logger.error({ name: this.name }, this.message);
    } else {
      logger.warn({ name: this.name }, this.message);
    }

    return {
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      ...(this._details && { details: this._details }),
    };
  }

  public get statusCode() {
    return this._statusCode;
  }

  public get code() {
    return this._code;
  }

  public get details() {
    return this._details;
  }

  public get isOperational() {
    return this._statusCode >= 400 && this._statusCode < 500;
  }
}
