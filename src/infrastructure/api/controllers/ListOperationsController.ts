import { Context } from "koa";

import ListOperationsUseCase from "@/core/use-cases/ListOperationsUseCase";

import Controller from "@/infrastructure/api/controllers/Controller";
import { ApiDeps } from "@/infrastructure/api";

export default class ListOperationsController implements Controller {
  handle(apiDeps: ApiDeps, ctx: Context): Promise<any> {
    const {
      limit = "",
      skip = "",
      orderBy = "desc",
      sortBy = "operationType",
    } = ctx.query;

    const limitParsed = parseInt(limit as string, 10);
    const skipParsed = parseInt(skip as string, 10);

    return new ListOperationsUseCase(apiDeps).execute({
      limit: isNaN(limitParsed) ? undefined : limitParsed,
      skip: isNaN(skipParsed) ? undefined : skipParsed,
      orderBy: orderBy as any,
      sortBy: sortBy as any,
    });
  }
}
