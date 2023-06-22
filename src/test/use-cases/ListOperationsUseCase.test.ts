import Operation, { OperationType } from "@/core/entities/Operation";
import createInMemoryRepository from "../utils/InMemoryRepository";
import ListOperaitonsUseCase from "@/core/use-cases/ListOperationsUseCase";

describe("UseCase - ListOperations", () => {
  test("should retrieve all operations", async () => {
    const operationsRepository = createInMemoryRepository<Operation>([
      new Operation({
        amount: 100,
        type: OperationType.ADDITION,
      }),
      new Operation({
        amount: 200,
        type: OperationType.SUBSTRACTION,
      }),
    ]);
    const listOperationsUseCase = new ListOperaitonsUseCase({
      operationsRepository,
    });
    const result = await listOperationsUseCase.execute({});
    expect(result.result).toMatchObject([
      { id: expect.any(String), amount: 100, type: OperationType.ADDITION },
      {
        id: expect.any(String),
        amount: 200,
        type: OperationType.SUBSTRACTION,
      },
    ]);
  });
});
