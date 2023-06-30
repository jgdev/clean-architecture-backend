import User from "@/core/entities/User";
import Record from "@/core/entities/Record";
import Operation from "@/core/entities/Operation";
import IEntityRepository from "@/core/repository/EntityRepository";
import OperationServiceFactory from "@/lib/services/OperationServiceFactory";
import NotFoundError from "@/core/errors/NotFoundError";
import ValidatorError from "../errors/ValidationError";

export type CreateRecordDTO = {
  userId: string;
  operationId: string;
  operationArgs: any[];
};
export type CreateRecordResultDTO = Record;

export default class CreateRecordUseCase {
  private recordsRepository: IEntityRepository<Record>;
  private usersRepository: IEntityRepository<User>;
  private operationsRepository: IEntityRepository<Operation>;

  constructor(deps: {
    usersRepository: IEntityRepository<User>;
    recordsRepository: IEntityRepository<Record>;
    operationsRepository: IEntityRepository<Operation>;
  }) {
    this.recordsRepository = deps.recordsRepository;
    this.usersRepository = deps.usersRepository;
    this.operationsRepository = deps.operationsRepository;
  }

  async execute(params: CreateRecordDTO): Promise<CreateRecordResultDTO> {
    if (!params.operationId)
      throw new ValidatorError("Invalid parameter operationId");
    const operation = await this.operationsRepository.findOne({
      id: params.operationId,
    });
    if (!operation) throw new NotFoundError("Operation not found");

    if (!params.userId) throw new ValidatorError("Invalid parameter userId");
    const user = await this.usersRepository.findOne({ id: params.userId });
    if (!user) throw new NotFoundError("User not found");

    const newUserBalance = user.balance - operation.cost;

    if (newUserBalance < 0)
      throw new ValidatorError(
        "The user does not have enought balance to perform this operation"
      );

    const operationResult = await OperationServiceFactory.getOperationByType(
      operation!.type
    ).perform(params.operationArgs);

    const record = new Record({
      userId: user.id,
      operationId: operation.id,
      cost: operation.cost,
      date: new Date(),
      operationType: operation.type,
      operationArgs: params.operationArgs,
      operationResult,
      oldUserBalance: user.balance,
      newUserBalance: newUserBalance,
    });

    const result = await this.recordsRepository.create(record);
    await this.usersRepository.update(
      { id: user!.id },
      { balance: record.newUserBalance }
    );
    return result;
  }
}
