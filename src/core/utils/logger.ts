import debug from "debug";

export const APP_NAME = "arithmetic-calculator";

export const createLogger = (name: string) => ({
  info: debug(`${APP_NAME}:info:${name}`),
  warn: debug(`${APP_NAME}:warn:${name}`),
  error: debug(`${APP_NAME}:error:${name}`),
  debug: debug(`${APP_NAME}:debug:${name}`),
  custom: (logLevel: string) => debug(`${APP_NAME}:${logLevel}`),
});

export const httpLogger = createLogger("http");
export const bootstrapLogger = createLogger("bootstrap");
