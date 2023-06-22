import httpStatus from "http-status";
import { Next } from "koa";

import { httpLogger } from "@/core/utils/logger";
import { BaseError, ErrorCode, ErrorType } from "@/core/errors";

import { ApiContext } from "..";

export default async (ctx: ApiContext, next: Next) => {
  const logger = httpLogger;
  try {
    await next();
  } catch (err) {
    const error = err as BaseError;
    error.type = error.type || ErrorType.Internal;
    error.message = error?.data?.response?.body?.detail || error.message;
    logger.error(err);
    ctx.error = err;
    switch (error.type) {
      case ErrorType.Validation:
        ctx.status = error.code || httpStatus.BAD_REQUEST;
        ctx.error.codeType = (ctx.error.codeType || "").startsWith("E_")
          ? ctx.error.codeType
          : ErrorCode.ValidationFailed;
        break;
      case ErrorType.Authorization:
        ctx.error.code = ctx.error.code || ErrorCode.NotAuthenticated;
        ctx.status =
          ctx.error.code === ErrorCode.OperationNotPermitted
            ? httpStatus.FORBIDDEN
            : httpStatus.UNAUTHORIZED;
        break;
      case ErrorType.Internal:
        ctx.error.code = ctx.error.code || ErrorCode.InternalError;
        if (ctx.error.code === ErrorCode.NotFound) {
          ctx.status = httpStatus.NOT_FOUND;
        } else {
          ctx.status = httpStatus.INTERNAL_SERVER_ERROR;
        }
        break;
    }
  }
};
