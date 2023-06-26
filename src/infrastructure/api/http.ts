import { bootstrapLogger, httpLogger } from "@/core/utils/logger";
import { getDependencies } from "./dependencies";
import { getDependencies as getDependenciesMock } from "./dependencies.mock";
import { checkLiveUser } from "@/lib/liveSession";
import { createApi } from ".";

const isMockArg =
  process.argv.indexOf("--mock") > -1 || !!process.env.SERVER_MOCK;

(async () => {
  const deps = await (isMockArg ? getDependenciesMock() : getDependencies());
  const api = createApi(deps, !!process.env.SKIP_AUTH);
  const httpPort = process.env.PORT || process.env.NODE_PORT || 3001;
  await checkLiveUser(deps);
  api.listen(httpPort, () => {
    httpLogger.info(`Api service running in http://localhost:${httpPort}/`);
  });
})().catch(bootstrapLogger.error);
