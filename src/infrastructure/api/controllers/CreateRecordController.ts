import { Context } from "koa";

import CreateRecordUseCase from "@/core/use-cases/CreateRecordUseCase";

import Controller from "@/infrastructure/api/controllers/Controller";
import { ApiDeps } from "@/infrastructure/api";

export default class CreateRecordController implements Controller {
  handle(apiDeps: ApiDeps, ctx: Context): Promise<any> {
    const { session } = ctx;
    const { operationId, operationArgs } = ctx.request.body as any;
    return new CreateRecordUseCase(apiDeps).execute({
      operationArgs,
      operationId,
      userId: session.user.id,
    });
  }
}
