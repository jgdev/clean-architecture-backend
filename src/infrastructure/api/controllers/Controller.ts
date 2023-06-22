import { RouterContext } from "koa-router";
import { ApiDeps } from "..";

export default abstract class Controller {
  abstract handle(apiDeps: ApiDeps, ctx: RouterContext): Promise<any>;
}
