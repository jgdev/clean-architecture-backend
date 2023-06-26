import dotenv from "dotenv";
import debug from "debug";
import { bootstrapLogger, httpLogger, APP_NAME } from "@/core/utils/logger";
import { getDependencies } from "./dependencies";
import { getDependencies as getDependenciesMock } from "./dependencies.mock";
import { checkLiveUser } from "@/lib/liveSession";
import { createApi } from ".";

const isMockArg =
  process.argv.indexOf("--mock") > -1 || !!process.env.SERVER_MOCK;

dotenv.config();

if (!process.env.DEBUG)
  debug.enable(`${APP_NAME}:info*,${APP_NAME}:error*,${APP_NAME}:warn*`);

(async () => {
  const deps = await (isMockArg ? getDependenciesMock() : getDependencies());
  const api = createApi(deps, !!process.env.SKIP_AUTH);
  const httpPort = process.env.PORT || process.env.NODE_PORT || 3001;
  await checkLiveUser(deps);
  api.listen(httpPort, () => {
    httpLogger.info(`Api service running on port: ${httpPort}`);
  });
})().catch(bootstrapLogger.error);
