import Record from "@/core/entities/Record";
import User, { UserStatus } from "@/core/entities/User";
import Operation, { OperationType } from "@/core/entities/Operation";
import IEntityRepository from "@/core/repository/EntityRepository";

import createInMemoryRepository, {
  ITestEntityRepository,
  createInMemoryRecordEntityRepository,
} from "../utils/InMemoryRepository";
import IRecordEntityRepository from "@/core/repository/RecordRepository";
import { randomUUID } from "crypto";
import RemoveRecordUseCase from "@/core/use-cases/RemoveRecordUseCase";

describe("UseCase - List Records", () => {
  let fakeRecords: Record[];
  let fakeUser: User;

  let fakeOperationAdd: Operation;
  let fakeOperationMultiply: Operation;

  let usersRepository: IEntityRepository<User>;
  let recordsRepository: IRecordEntityRepository;
  let operaitonsRepository: IEntityRepository<Operation>;

  let removeRecordUseCase: RemoveRecordUseCase;

  beforeEach(() => {
    fakeUser = new User({
      balance: 200,
      email: "test@test",
      status: UserStatus.ACTIVE,
    });
    fakeOperationAdd = new Operation({
      cost: 100,
      type: OperationType.ADDITION,
    });
    fakeRecords = [
      new Record({
        cost: 100,
        newUserBalance: 100,
        oldUserBalance: 200,
        operationArgs: [],
        operationId: fakeOperationAdd.id,
        operationResult: 0,
        date: new Date(),
        userId: fakeUser.id,
      }),
      new Record({
        cost: 100,
        newUserBalance: 100,
        oldUserBalance: 200,
        operationArgs: [],
        operationId: fakeOperationAdd.id,
        operationResult: 0,
        date: new Date(),
        userId: randomUUID(),
      }),
    ];
    usersRepository = createInMemoryRepository<User>([fakeUser]);
    operaitonsRepository = createInMemoryRepository<Operation>([
      fakeOperationAdd,
      fakeOperationMultiply,
    ]);
    recordsRepository = createInMemoryRecordEntityRepository(
      operaitonsRepository,
      fakeRecords
    );
    removeRecordUseCase = new RemoveRecordUseCase({
      recordsRepository,
      usersRepository,
    });
  });

  it("should remove a records by userId", async () => {
    const testRepository =
      recordsRepository as any as ITestEntityRepository<Record>;
    expect(testRepository.records.length).toBe(2);
    await removeRecordUseCase.execute({
      recordId: fakeRecords[0].id,
      userId: fakeUser.id,
    });
    expect(
      testRepository.records.filter((record) => !record.isDeleted).length
    ).toBe(1);
  });

  it("should return if tries to remove a record of another user", async () => {
    expect.assertions(1);
    try {
      await removeRecordUseCase.execute({
        recordId: fakeRecords[1].id,
        userId: fakeUser.id,
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Record not found/);
    }
  });

  it("should validate parameters", async () => {
    expect.assertions(4);
    try {
      await removeRecordUseCase.execute({
        recordId: fakeRecords[0].id,
        userId: "",
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid parameter userId/);
    }
    try {
      await removeRecordUseCase.execute({
        recordId: fakeRecords[0].id,
        userId: randomUUID(),
      });
    } catch (err: any) {
      expect(err.message).toMatch(/User not found/);
    }
    try {
      await removeRecordUseCase.execute({
        recordId: randomUUID(),
        userId: fakeUser.id,
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Record not found/);
    }
    try {
      await removeRecordUseCase.execute({
        userId: fakeUser.id,
        recordId: "",
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid parameter recordId/);
    }
  });
});
