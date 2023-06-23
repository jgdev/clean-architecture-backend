import debug from "debug";
import dotenv from "dotenv";
import { createApi } from ".";
import { APP_NAME, httpLogger } from "@/core/utils/logger";
import { prepareTestEnvironment } from "@/test/unit/utils/InMemory.bootstrap";

dotenv.config();

if (!process.env.DEBUG) debug.enable(`${APP_NAME}:info*,${APP_NAME}:error*`);

export const getDependencies = async () => {
  const apiDependencies = await prepareTestEnvironment();
  return apiDependencies;
};

(async () => {
  const httpPort = process.env.PORT || process.env.NODE_PORT || 3001;
  const apiDeps = await getDependencies();
  const api = createApi(apiDeps, !!process.env.SKIP_AUTH);
  api.listen(httpPort, () => {
    httpLogger.info(`Api service running in http://localhost:${httpPort}/`);
  });
})().catch(console.error);
