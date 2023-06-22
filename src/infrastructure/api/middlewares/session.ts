import { Context, Next } from "koa";
import { randomUUID } from "crypto";

import AuthorizationError from "@/core/errors/AuthorizationError";
import { ErrorCode } from "@/core/errors";

import { Api, ApiDeps } from "..";

export const createSessionMiddleware = (deps: ApiDeps, skipAuth: boolean) => {
  return {
    withSession: async (ctx: Context, next: Next) => {
      let sessionId = ctx.request.headers["x-session-id"] as string;
      let user = undefined;

      if (skipAuth) {
        user = await deps.usersRepository.findOne({});
        sessionId = randomUUID();
      } else {
        if (!sessionId) {
          throw new AuthorizationError({
            codeType: ErrorCode.NotAuthenticated,
            message: "Missing x-session-id header",
            data: { displayError: true },
          });
        }
        user = await deps.sessionService.getUserBySessionId(sessionId);
      }

      ctx.session = {
        id: sessionId,
        user,
      };

      await next();
    },
  };
};

export default createSessionMiddleware;
