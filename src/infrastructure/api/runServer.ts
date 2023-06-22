import debug from "debug";
import dotenv from "dotenv";
import { ApiDeps, createApi } from ".";
import { APP_NAME } from "@/core/utils/logger";

import { httpLogger } from "@/core/utils/logger";
import { prepareTestEnvironment } from "@/test/utils/InMemory.bootstrap";

dotenv.config();

if (!process.env.DEBUG) debug.enable(`${APP_NAME}:info*,${APP_NAME}:error*`);

export const getDependencies = async () => {
  let apiDependencies: ApiDeps;

  if (process.env.IN_MEMORY_REPOSITORY) {
    apiDependencies = await prepareTestEnvironment();
  } else {
    const mongoClient = {};
    const redisClient = null;
    apiDependencies = {} as ApiDeps;
  }

  return apiDependencies;
};

(async () => {
  const httpPort = process.env.PORT || process.env.NODE_PORT || 3001;
  const apiDeps = await getDependencies();
  const api = createApi(apiDeps);
  api.listen(httpPort, () => {
    httpLogger.info(`Api service running in http://localhost:${httpPort}/`);
  });
})().catch(console.error);
