import { Context } from "koa";

import ListOperationsUseCase from "@/core/use-cases/ListOperationsUseCase";

import Controller from "@/infrastructure/api/controllers/Controller";
import { ApiDeps } from "@/infrastructure/api";
import { parseNumberOrDefault } from "@/core/utils/validation";
import { DEFAULT_ROWS_LIMIT } from "@/core/repository";

export default class ListOperationsController implements Controller {
  handle(apiDeps: ApiDeps, ctx: Context): Promise<any> {
    const { limit, skip, orderBy, sortBy } = ctx.query;

    return new ListOperationsUseCase(apiDeps).execute({
      limit: parseNumberOrDefault(limit, DEFAULT_ROWS_LIMIT),
      skip: parseNumberOrDefault(skip, 0),
      orderBy: orderBy as any,
      sortBy: sortBy as any,
    });
  }
}
