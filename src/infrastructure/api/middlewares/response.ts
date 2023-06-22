import Koa from "koa";

export default async (ctx: Koa.Context, next: Koa.Next) => {
  const now = Date.now();
  await next();
  const status = ctx.status || (ctx.body as any).status;
  const error =
    (ctx.error && {
      message: ctx.error?.msg || ctx.error?.message,
      type: ctx.error.type,
    }) ||
    null;
  ctx.body = {
    meta: {
      duration: Date.now() - now + "ms",
      now,
    },
    statusCode: status,
    detail:
      process.env.NODE_ENV !== "production" || !!ctx.error?.data?.displayError
        ? error?.detail || error?.message
        : undefined,
    msg: ctx.message || (ctx.body as any).message,
    result: ctx.body || null,
  };
  ctx.status = status;
};
