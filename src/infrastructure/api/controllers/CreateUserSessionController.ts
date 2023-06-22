import { Context } from "koa";

import CreateUserSessionUseCase from "@/core/use-cases/CreateUserSessionUseCase";

import Controller from "@/infrastructure/api/controllers/Controller";
import { ApiDeps } from "@/infrastructure/api";

export default class CreateUserSessionController implements Controller {
  handle(apiDeps: ApiDeps, ctx: Context): Promise<any> {
    const { email, password } = ctx.request.body as any;
    return new CreateUserSessionUseCase(apiDeps).execute({
      email,
      password,
    });
  }
}
