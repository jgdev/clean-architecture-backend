import { Context } from "koa";

import ListRecordsUseCase from "@/core/use-cases/ListRecordsUseCase";

import Controller from "@/infrastructure/api/controllers/Controller";
import { ApiDeps } from "@/infrastructure/api";
import { parseNumberOrDefault, objectOrDefault } from "@/core/utils/validation";
import { DEFAULT_ROWS_LIMIT } from "@/core/repository";

export default class ListRecordsController implements Controller {
  handle(apiDeps: ApiDeps, ctx: Context): Promise<any> {
    const { session } = ctx;
    const { limit, skip, operationType, orderBy, sortBy } = ctx.query;

    return new ListRecordsUseCase(apiDeps).execute(
      {
        userId: session.user.id,
        operationType: operationType as any,
      },
      {
        limit: parseNumberOrDefault(limit, DEFAULT_ROWS_LIMIT),
        skip: parseNumberOrDefault(skip, 0),
        orderBy: objectOrDefault(orderBy, "date") as any,
        sortBy: objectOrDefault(sortBy, "desc") as any,
      }
    );
  }
}
