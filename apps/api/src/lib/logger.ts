import pino from "pino";

const isDevelopment =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

const options: pino.LoggerOptions = {
  level: isDevelopment ? "debug" : "info",
};

if (isDevelopment) {
  options.transport = {
    target: "pino-pretty",
    options: {
      colorize: true,
      ignore: "pid,hostname",
    },
  };
}

export const logger = pino(options);
