import "./bootstrap";
import serverless from "serverless-http";
import { bootstrapLogger } from "@/core/utils/logger";
import { getDependencies } from "./dependencies";
import { getDependencies as getDependenciesMock } from "./dependencies.mock";
import { createApi } from ".";

const isMockArg =
  process.argv.indexOf("--mock") > -1 || !!process.env.SERVER_MOCK;

export const handler = async (event: any, context: any) => {
  const deps = await (isMockArg ? getDependenciesMock() : getDependencies());
  try {
    const api = createApi(deps, !!process.env.SKIP_AUTH);
    const execHandler = serverless(api);
    const result = await execHandler(event, context);
    deps.shutdown();
    return result;
  } catch (err) {
    bootstrapLogger.error(err);
    deps.shutdown();
  }
};
