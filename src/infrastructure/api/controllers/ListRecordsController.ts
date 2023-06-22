import { Context } from "koa";

import ListRecordsUseCase from "@/core/use-cases/ListRecordsUseCase";

import Controller from "@/infrastructure/api/controllers/Controller";
import { ApiDeps } from "@/infrastructure/api";

export default class ListRecordsController implements Controller {
  handle(apiDeps: ApiDeps, ctx: Context): Promise<any> {
    const { session } = ctx;
    const {
      limit = "",
      skip = "",
      operationType = undefined,
      orderBy = "desc",
      sortBy = "timestamp",
    } = ctx.query;

    const limitParsed = parseInt(limit as string, 10);
    const skipParsed = parseInt(skip as string, 10);

    return new ListRecordsUseCase(apiDeps).execute(
      {
        userId: session.user.id,
        operationType: operationType as any,
      },
      {
        limit: isNaN(limitParsed) ? undefined : limitParsed,
        skip: isNaN(skipParsed) ? undefined : skipParsed,
        orderBy: orderBy as any,
        sortBy: sortBy as any,
      }
    );
  }
}
