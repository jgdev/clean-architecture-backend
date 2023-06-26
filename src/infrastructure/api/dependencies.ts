import { PrismaClient } from "@prisma/client";
import { createClient } from "redis";

import { redisCacheLogger } from "@/core/utils/logger";
import SessionService from "@/core/services/auth/SessionService";
import RedisCacheRepository from "@/infrastructure/database/RedisCacheRepository";
import PrismaOperationsRepository from "@/infrastructure/database/PrismaOperationsRepository";
import PrismaRecordsRepository from "@/infrastructure/database/PrismaRecordsRepository";
import PrismaUsersRepository from "@/infrastructure/database/PrismaUsersRepository";

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

  const deps = {
    cacheRepository,
    operationsRepository,
    recordsRepository,
    usersRepository,
    sessionService,
  };

  return deps;
};
