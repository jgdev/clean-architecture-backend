import SessionService from "@/core/services/auth/SessionService";
import createInMemoryRepository, {
  createInMemoryRecordEntityRepository,
} from "./InMemoryRepository";
import createInMemoryCacheRepository from "./InMemoryCacheRepository";
import Operation, { OperationType } from "@/core/entities/Operation";
import User, { UserStatus } from "@/core/entities/User";
import { checkLiveUser } from "@/lib/liveSession";

export const prepareTestEnvironment = async () => {
  const cacheRepository = createInMemoryCacheRepository();
  const operationsRepository = createInMemoryRepository<Operation>([
    new Operation({
      cost: 20,
      type: OperationType.ADDITION,
    }),
    new Operation({
      cost: 20,
      type: OperationType.SUBTRACTION,
    }),
    new Operation({
      cost: 50,
      type: OperationType.MULTIPLICATION,
    }),
    new Operation({
      cost: 50,
      type: OperationType.DIVISION,
    }),
    new Operation({
      cost: 80,
      type: OperationType.SQUARE_ROOT,
    }),
    new Operation({
      cost: 100,
      type: OperationType.RANDOM_STRING,
    }),
  ]);
  const recordsRepository =
    createInMemoryRecordEntityRepository(operationsRepository);
  const usersRepository = createInMemoryRepository<User>([]);
  const sessionService = new SessionService({
    cacheRepository,
    usersRepository,
  });

  const deps = {
    cacheRepository,
    recordsRepository,
    usersRepository,
    sessionService,
    operationsRepository,
  };

  const testUser = await checkLiveUser(deps);

  return {
    ...deps,
    testUser,
  };
};
