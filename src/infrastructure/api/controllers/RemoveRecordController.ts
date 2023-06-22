import { Context } from "koa";

import RemoveRecordUseCase from "@/core/use-cases/RemoveRecordUseCase";

import Controller from "@/infrastructure/api/controllers/Controller";
import { ApiDeps } from "@/infrastructure/api";

export default class RemoveRecordController implements Controller {
  handle(apiDeps: ApiDeps, ctx: Context): Promise<any> {
    const {
      session,
      params: { recordId = "" },
    } = ctx;
    return new RemoveRecordUseCase(apiDeps).execute({
      recordId,
      userId: session.user.id,
    });
  }
}
