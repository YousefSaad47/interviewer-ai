import express from "express";

import { HttpStatus } from "../enums";

export const extendResponse = () => {
  express.response.ok = function (this, data?: unknown) {
    return this.status(HttpStatus.OK).json({
      data: data ?? null,
      message: "OK",
    });
  };

  express.response.created = function (this, data?: unknown) {
    return this.status(HttpStatus.CREATED).json({
      data: data ?? null,
      message: "Created",
    });
  };

  express.response.accepted = function (this, data?: unknown) {
    return this.status(HttpStatus.ACCEPTED).json({
      data: data ?? null,
      message: "Accepted",
    });
  };

  express.response.noContent = function (this) {
    return this.status(HttpStatus.NO_CONTENT).end();
  };
};
