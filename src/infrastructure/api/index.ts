import Koa, { Context } from "koa";
import KoaBody from "koa-bodyparser";

import Operation from "@/core/entities/Operation";
import User from "@/core/entities/User";
import ICacheRepository from "@/core/repository/CacheRepository";
import IEntityRepository from "@/core/repository/EntityRepository";
import IRecordEntityRepository from "@/core/repository/RecordRepository";
import SessionService from "@/core/services/auth/SessionService";

import errorHandlerMiddleware from "./middlewares/errorHandler";
import responseMiddleware from "./middlewares/response";
import createSessionMiddleware from "./middlewares/session";
import loggerMiddleware from "./middlewares/logger";

import v1Routers from "./routes/v1";
import v2Routers from "./routes/v2";
import { httpLogger } from "@/core/utils/logger";

export type ApiDeps = {
  usersRepository: IEntityRepository<User>;
  operationsRepository: IEntityRepository<Operation>;
  recordsRepository: IRecordEntityRepository;
  cacheRepository: ICacheRepository;
  sessionService: SessionService;
};

export type ApiContext = Context & {
  session?: {
    id: string;
    user: User;
  };
};

export type Api = Koa<Koa.DefaultState, ApiContext> & {
  withSession: (ctx: ApiContext, next: Koa.Next) => Promise<void> | void;
};

export const createApi = (deps: ApiDeps, skipAuth: boolean) => {
  const app = new Koa<Koa.DefaultState, ApiContext>() as Api;
  const { withSession } = createSessionMiddleware(deps, skipAuth);

  app.withSession = withSession;

  if (skipAuth)
    httpLogger.warn("Skip auth is enabled, bypassing session validation");

  app.use(async (ctx, next) => {
    // delay response
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve(undefined);
      }, 200)
    );
    await next();
  });
  app.use((ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*");
    ctx.set("Access-Control-Allow-Headers", "*");
    return next();
  });
  app.use(KoaBody());

  app.use(responseMiddleware);
  app.use(errorHandlerMiddleware);
  app.use(loggerMiddleware);

  v1Routers(app, deps);

  return app;
};
