import { Context } from "koa";

import RemoveUserSessionUseCase from "@/core/use-cases/RemoveUserSessionUseCase";

import Controller from "@/infrastructure/api/controllers/Controller";
import { ApiDeps } from "@/infrastructure/api";

export default class RemoveUserSessionController implements Controller {
  handle(apiDeps: ApiDeps, ctx: Context): Promise<any> {
    const { session } = ctx;
    return new RemoveUserSessionUseCase(apiDeps).execute({
      email: session.user.email,
      sessionId: session.id,
    });
  }
}
