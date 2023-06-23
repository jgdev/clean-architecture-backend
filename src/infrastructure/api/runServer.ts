import debug from "debug";
import dotenv from "dotenv";
import { createClient } from "redis";
import { APP_NAME, httpLogger, redisCacheLogger } from "@/core/utils/logger";
import { PrismaClient } from "@prisma/client";

import RedisCacheRepository from "@/infrastructure/database/RedisCacheRepository";
import PrismaOperationsRepository from "@/infrastructure/database/PrismaOperationsRepository";
import PrismaRecordsRepository from "@/infrastructure/database/PrismaRecordsRepository";
import PrismaUsersRepository from "@/infrastructure/database/PrismaUsersRepository";
import SessionService from "@/core/services/auth/SessionService";

import { createApi } from ".";

dotenv.config();

if (!process.env.DEBUG) debug.enable(`${APP_NAME}:info*,${APP_NAME}:error*`);

export const getDependencies = async () => {
  // connect to database
  const prismaClient = new PrismaClient();
  await prismaClient.$connect();

  // connect to cache
  const redisClient = createClient();
  redisClient.on("error", redisCacheLogger.error);
  await redisClient.connect();

  const cacheRepository = new RedisCacheRepository(redisClient);
  const operationsRepository = new PrismaOperationsRepository(prismaClient);
  const recordsRepository = new PrismaRecordsRepository(prismaClient);
  const usersRepository = new PrismaUsersRepository(prismaClient);
  const sessionService = new SessionService({
    cacheRepository,
    usersRepository,
  });

  return {
    cacheRepository,
    operationsRepository,
    recordsRepository,
    usersRepository,
    sessionService,
  };
};

(async () => {
  const httpPort = process.env.PORT || process.env.NODE_PORT || 3001;
  const apiDeps = await getDependencies();
  const api = createApi(apiDeps, false);
  api.listen(httpPort, () => {
    httpLogger.info(`Api service running in http://localhost:${httpPort}/`);
  });
})().catch(console.error);
