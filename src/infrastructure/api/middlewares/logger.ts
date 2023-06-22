import { DefaultContext, Next } from "koa";

import { httpLogger } from "@/core/utils/logger";

const logReq = (log: any) => {
  httpLogger.custom("info:http:req")(log);
};
const logRes = (log: any) => {
  httpLogger.custom("info:http:res")(log);
};
const logJSON = (json: any) => {
  httpLogger.custom("info:http:json")(json);
};

export const isReadableContent = (body: any) => {
  try {
    return (
      typeof body === "object" &&
      (body.constructor.name === "ReadStream" ||
        body.constructor.name === "BodyTransParserStream")
    );
  } catch (ignore) {
    return false;
  }
};

export const readableToString = (readable: any) =>
  new Promise((resolve, reject) => {
    let data: any;

    readable.on("data", (chunk: any) =>
      data ? (data += chunk) : (data = chunk)
    );
    readable.on("end", (err: Error) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });

export const loggerMiddleware = async (ctx: DefaultContext, next: Next) => {
  const startDate = Date.now();
  ctx.startDate = startDate;

  let safeIP: string = "";

  if (
    ctx.get("X-Real-IP") &&
    ctx.ips.length > 0 &&
    process.env.NODE_ENV === "production"
  ) {
    safeIP = ctx.get("X-Real-IP");
  }

  safeIP = safeIP || ctx.request.ip;

  /* End Secure X-Forwarded-For */

  logReq(
    `[${new Date()}] ${safeIP} | ${ctx.request.method} ${ctx.request.url}`
  );
  logReq(`Headers: ${JSON.stringify(ctx.request.headers)}`);

  logJSON(ctx.request.body);

  if (Object.keys(ctx.request.body || {}).length) {
    logJSON(
      `Req: ${ctx.request.method} ${ctx.request.url} => ${JSON.stringify(
        ctx.request.body
      )}`
    );
  }

  await next();

  const ms = Date.now() - startDate;

  logJSON(
    `Res: ${ctx.request.method} ${ctx.request.url} <= ${JSON.stringify(
      ctx.body
    )}`
  );

  logRes(
    `[${new Date()}] ${safeIP} | ${ctx.request.method} ${
      ctx.request.url
    } (${ms} ms) | ${ctx.response.status}`
  );
  logRes(`Headers: ${JSON.stringify(ctx.response.headers)}`);
};

export default loggerMiddleware;
