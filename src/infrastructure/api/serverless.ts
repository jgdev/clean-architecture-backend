import serverless from "serverless-http";
import { bootstrapLogger } from "@/core/utils/logger";
import { getDependencies } from "./dependencies";
import { getDependencies as getDependenciesMock } from "./dependencies.mock";
import { checkLiveUser } from "@/lib/liveSession";
import { createApi } from ".";

const isMockArg =
  process.argv.indexOf("--mock") > -1 || !!process.env.SERVER_MOCK;

export const handler = async (event: any, context: any) => {
  try {
    const deps = await (isMockArg ? getDependenciesMock() : getDependencies());
    const api = createApi(deps, !!process.env.SKIP_AUTH);
    await checkLiveUser(deps);
    const execHandler = serverless(api);
    return execHandler(event, context);
  } catch (err) {
    bootstrapLogger.error(err);
  }
};
