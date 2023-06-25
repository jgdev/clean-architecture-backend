import Operation, { OperationType } from "@/core/entities/Operation";
import createInMemoryRepository from "../utils/InMemoryRepository";
import ListOperaitonsUseCase from "@/core/use-cases/ListOperationsUseCase";

describe("UseCase - ListOperations", () => {
  test("should retrieve all operations", async () => {
    const operationsRepository = createInMemoryRepository<Operation>([
      new Operation({
        cost: 100,
        type: OperationType.ADDITION,
      }),
      new Operation({
        cost: 200,
        type: OperationType.SUBTRACTION,
      }),
    ]);
    const listOperationsUseCase = new ListOperaitonsUseCase({
      operationsRepository,
    });
    const result = await listOperationsUseCase.execute({});
    expect(result.result).toMatchObject([
      { id: expect.any(String), cost: 100, type: OperationType.ADDITION },
      {
        id: expect.any(String),
        cost: 200,
        type: OperationType.SUBTRACTION,
      },
    ]);
  });
});
