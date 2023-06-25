import { Context } from "koa";

import { ApiDeps } from "..";
import Controller from "./Controller";

import GetUserBySessionUseCase from "@/core/use-cases/GetUserBySessionUseCase";

export default class GetUserBySessionController extends Controller {
  async handle(apiDeps: ApiDeps, ctx: Context): Promise<any> {
    const { session } = ctx;
    return new GetUserBySessionUseCase({
      sessionService: apiDeps.sessionService,
    }).execute({
      sessionId: session.id,
    });
  }
}
