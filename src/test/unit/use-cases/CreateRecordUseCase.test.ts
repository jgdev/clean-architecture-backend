import { randomUUID } from "crypto";

import Record from "@/core/entities/Record";
import CreateRecordUseCase from "@/core/use-cases/CreateRecordUseCase";
import User, { UserStatus } from "@/core/entities/User";
import Operation, { OperationType } from "@/core/entities/Operation";
import IEntityRepository from "@/core/repository/EntityRepository";
import OperationServiceFactory from "@/lib/services/operations/OperationServiceFactory";
import OperationImpl from "@/lib/services/operations/OperationImpl";

import createInMemoryRepository from "../utils/InMemoryRepository";

describe("UseCase - Create Record", () => {
  let fakeUser: User;
  let fakeOperation: Operation;

  let usersRepository: IEntityRepository<User>;
  let recordsRepository: IEntityRepository<Record>;
  let operationsRepository: IEntityRepository<Operation>;

  let createRecordUseCase: CreateRecordUseCase;

  beforeEach(() => {
    fakeUser = new User({
      balance: 200,
      email: "test@test",
      status: UserStatus.ACTIVE,
    });

    fakeOperation = new Operation({
      amount: 10.5,
      type: OperationType.ADDITION,
    });

    recordsRepository = createInMemoryRepository<Record>();
    usersRepository = createInMemoryRepository<User>([fakeUser]);
    operationsRepository = createInMemoryRepository<Operation>([fakeOperation]);

    createRecordUseCase = new CreateRecordUseCase({
      recordsRepository,
      usersRepository,
      operationsRepository,
    });
  });

  test("should create an operation record properly", async () => {
    const expectedFakeOperationResult = 3;
    OperationServiceFactory.getOperationByType = jest.fn(
      () =>
        new (class FakeOperation implements OperationImpl {
          async perform(..._: any[]): Promise<any> {
            return expectedFakeOperationResult;
          }
        })()
    );
    const record = await createRecordUseCase.execute({
      userId: fakeUser.id,
      operationId: fakeOperation.id,
      operationArgs: [1, 2],
    });
    const user = await usersRepository.findOne({ email: fakeUser.email });
    expect(user?.balance).toBe(189.5);
    expect(record).toMatchObject({
      id: expect.any(String),
      userId: fakeUser.id,
      operationId: fakeOperation.id,
      amount: fakeOperation.amount,
      operationArgs: [1, 2],
      operationResult: expectedFakeOperationResult,
      timestamp: expect.any(Number),
      oldUserBalance: 200,
      newUserBalance: 189.5,
    });
  });

  test("should throw an error if the user doesn't have enough balance performing the operation", async () => {
    expect.assertions(2);
    try {
      await usersRepository.update({ email: fakeUser.email }, { balance: 0 });
      const user = await usersRepository.findOne({ email: fakeUser.email });
      expect(user?.balance).toBe(0);

      await createRecordUseCase.execute({
        userId: fakeUser.id,
        operationId: fakeOperation.id,
        operationArgs: [1, 2],
      });
    } catch (err: any) {
      expect(err.message).toMatch(
        /The user does not have enought balance to perform this operation/
      );
    }
  });

  test("should validate parameters", async () => {
    expect.assertions(4);
    createRecordUseCase = new CreateRecordUseCase({
      recordsRepository,
      usersRepository,
      operationsRepository,
    });

    try {
      await createRecordUseCase.execute({
        userId: randomUUID(),
        operationId: fakeOperation.id,
        operationArgs: [1, 2],
      });
    } catch (err: any) {
      expect(err.message).toMatch(/User not found/);
    }

    try {
      await createRecordUseCase.execute({
        userId: "",
        operationId: fakeOperation.id,
        operationArgs: [1, 2],
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid parameter userId/);
    }

    try {
      await createRecordUseCase.execute({
        userId: fakeUser.id,
        operationId: "",
        operationArgs: [1, 2],
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid parameter operationId/);
    }

    try {
      await createRecordUseCase.execute({
        userId: fakeUser.id,
        operationId: randomUUID(),
        operationArgs: [1, 2],
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Operation not found/);
    }
  });
});
