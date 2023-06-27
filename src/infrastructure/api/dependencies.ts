import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

import { redisCacheLogger } from "@/core/utils/logger";
import SessionService from "@/core/services/auth/SessionService";
import RedisCacheRepository from "@/infrastructure/database/RedisCacheRepository";
import PrismaOperationsRepository from "@/infrastructure/database/PrismaOperationsRepository";
import PrismaRecordsRepository from "@/infrastructure/database/PrismaRecordsRepository";
import PrismaUsersRepository from "@/infrastructure/database/PrismaUsersRepository";
import { ApiDeps } from ".";

export const getDependencies = async (): Promise<ApiDeps> => {
  // connect to database
  const prismaClient = new PrismaClient();
  await prismaClient.$connect();

  // connect to cache
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });
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

  const deps = {
    cacheRepository,
    operationsRepository,
    recordsRepository,
    usersRepository,
    sessionService,
    shutdown: async () => {
      await redisClient.disconnect();
      await prismaClient.$disconnect();
    },
  };

  return deps;
};
