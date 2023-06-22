import SessionService from "@/core/services/auth/SessionService";
import createInMemoryRepository, {
  createInMemoryRecordEntityRepository,
} from "./InMemoryRepository";
import { createInMemoryCacheRepository } from "./InMemoryCacheRepository";
import Operation, { OperationType } from "@/core/entities/Operation";
import User, { UserStatus } from "@/core/entities/User";

export const prepareTestEnvironment = async () => {
  const cacheRepository = createInMemoryCacheRepository();
  const operationsRepository = createInMemoryRepository<Operation>([
    new Operation({
      amount: 20,
      type: OperationType.ADDITION,
    }),
    new Operation({
      amount: 20,
      type: OperationType.SUBSTRACTION,
    }),
    new Operation({
      amount: 50,
      type: OperationType.MULTIPLICATION,
    }),
    new Operation({
      amount: 50,
      type: OperationType.DIVISION,
    }),
    new Operation({
      amount: 80,
      type: OperationType.SQUARE_ROOT,
    }),
    new Operation({
      amount: 100,
      type: OperationType.RANDOM_STRING,
    }),
  ]);
  const recordsRepository =
    createInMemoryRecordEntityRepository(operationsRepository);
  const testUser = new User({
    balance: 200,
    email: "test@test",
    status: UserStatus.ACTIVE,
  });
  await testUser.setPassword("test123");
  const usersRepository = createInMemoryRepository<User>([testUser]);
  const sessionService = new SessionService({
    cacheRepository,
    usersRepository,
  });
  return {
    cacheRepository,
    recordsRepository,
    usersRepository,
    sessionService,
    operationsRepository,
  };
};
