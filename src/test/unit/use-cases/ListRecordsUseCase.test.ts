import Record from "@/core/entities/Record";
import User, { UserStatus } from "@/core/entities/User";
import Operation, { OperationType } from "@/core/entities/Operation";
import IEntityRepository from "@/core/repository/EntityRepository";
import ListRecordsUseCase from "@/core/use-cases/ListRecordsUseCase";

import createInMemoryRepository, {
  createInMemoryRecordEntityRepository,
} from "../utils/InMemoryRepository";
import IRecordEntityRepository from "@/core/repository/RecordRepository";
import { randomUUID } from "crypto";

describe("UseCase - List Records", () => {
  let fakeRecords: Record[];
  let fakeUser: User;
  let fakeUser2: User;

  let fakeOperationAdd: Operation;
  let fakeOperationMultiply: Operation;

  let usersRepository: IEntityRepository<User>;
  let recordsRepository: IRecordEntityRepository;
  let operaitonsRepository: IEntityRepository<Operation>;

  let listRecordsUseCase: ListRecordsUseCase;

  beforeEach(() => {
    fakeUser = new User({
      balance: 200,
      email: "test@test",
      status: UserStatus.ACTIVE,
    });
    fakeUser2 = new User({
      balance: 100,
      email: "test2@test2",
      status: UserStatus.ACTIVE,
    });
    fakeOperationAdd = new Operation({
      amount: 100,
      type: OperationType.ADDITION,
    });
    fakeOperationMultiply = new Operation({
      amount: 100,
      type: OperationType.MULTIPLICATION,
    });
    fakeRecords = [
      new Record({
        amount: 100,
        newUserBalance: 100,
        oldUserBalance: 200,
        operationArgs: [],
        operationId: fakeOperationAdd.id,
        operationResult: 0,
        timestamp: Date.now(),
        userId: fakeUser2.id,
      }),
      new Record({
        amount: 100,
        newUserBalance: 100,
        oldUserBalance: 200,
        operationArgs: [],
        operationId: fakeOperationAdd.id,
        operationResult: 0,
        timestamp: Date.now(),
        userId: fakeUser.id,
      }),
      new Record({
        amount: 30,
        newUserBalance: 10,
        oldUserBalance: 40,
        operationArgs: [],
        operationId: fakeOperationMultiply.id,
        operationResult: 0,
        timestamp: Date.now() + 30,
        userId: fakeUser2.id,
      }),
    ];
    usersRepository = createInMemoryRepository<User>([fakeUser, fakeUser2]);
    operaitonsRepository = createInMemoryRepository<Operation>([
      fakeOperationAdd,
      fakeOperationMultiply,
    ]);
    recordsRepository = createInMemoryRecordEntityRepository(
      operaitonsRepository,
      fakeRecords
    );
    listRecordsUseCase = new ListRecordsUseCase({
      recordsRepository,
      usersRepository,
    });
  });

  it("should retrieve all records by userId", async () => {
    const result = await listRecordsUseCase.execute({
      userId: fakeUser2.id,
    });
    expect(result).toMatchObject({
      total: 2,
      limit: expect.any(Number),
      skip: expect.any(Number),
    });
  });

  it("should retrieve all records filtered by operation type", async () => {
    const result = await listRecordsUseCase.execute({
      userId: fakeUser2.id,
      operationType: OperationType.ADDITION,
    });

    expect(result).toMatchObject({
      result: [fakeRecords[0]],
      total: 1,
      limit: expect.any(Number),
      skip: expect.any(Number),
    });
  });

  it("should retrieve all records sorted by timestamp field", async () => {
    const result = await listRecordsUseCase.execute(
      {
        userId: fakeUser2.id,
      },
      { sortBy: "timestamp" }
    );
    expect(result).toMatchObject({
      result: [fakeRecords[2], fakeRecords[0]],
      total: 2,
      limit: expect.any(Number),
      skip: expect.any(Number),
    });
    const result2 = await listRecordsUseCase.execute(
      {
        userId: fakeUser2.id,
      },
      { sortBy: "timestamp", orderBy: "asc" }
    );
    expect(result2).toMatchObject({
      result: [fakeRecords[0], fakeRecords[2]],
      total: 2,
      limit: expect.any(Number),
      skip: expect.any(Number),
    });
  });

  it("should validate parameters", async () => {
    expect.assertions(2);
    try {
      await listRecordsUseCase.execute({
        userId: "",
      });
    } catch (err: any) {
      expect(err.message).toMatch(/"userId" field is required/);
    }
    try {
      await listRecordsUseCase.execute({
        userId: randomUUID(),
      });
    } catch (err: any) {
      expect(err.message).toMatch(/User not found/);
    }
  });
});
