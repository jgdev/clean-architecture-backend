import { Context } from "koa";

import ListOperationsUseCase from "@/core/use-cases/ListOperationsUseCase";

import Controller from "@/infrastructure/api/controllers/Controller";
import { ApiDeps } from "@/infrastructure/api";

export default class ListOperationsController implements Controller {
  handle(apiDeps: ApiDeps, ctx: Context): Promise<any> {
    const { limit, skip, orderBy, sortBy } = ctx.query;

    const limitParsed = parseInt(limit as string, 10);
    const skipParsed = parseInt(skip as string, 10);

    return new ListOperationsUseCase(apiDeps).execute({
      limit: limitParsed,
      skip: skipParsed,
      orderBy: orderBy as any,
      sortBy: sortBy as any,
    });
  }
}
