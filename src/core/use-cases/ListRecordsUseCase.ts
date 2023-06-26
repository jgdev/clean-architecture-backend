import Record from "@/core/entities/Record";
import User from "@/core/entities/User";
import { OperationType } from "@/core/entities/Operation";
import IEntityRepository from "@/core/repository/EntityRepository";
import NotFoundError from "../errors/NotFoundError";
import { PaginatedResult, PaginatedParams } from "../repository";
import IRecordEntityRepository from "../repository/RecordRepository";
import ValidatorError from "../errors/ValidationError";

export type ListRecordsDTO = {
  userId: string;
  operationType?: OperationType;
};
export type ListRecordsResultDTO = PaginatedResult<Record>;

export default class ListRecordsUseCase {
  private recordsRepository: IRecordEntityRepository;
  private usersRepository: IEntityRepository<User>;

  constructor(deps: {
    recordsRepository: IRecordEntityRepository;
    usersRepository: IEntityRepository<User>;
  }) {
    this.recordsRepository = deps.recordsRepository;
    this.usersRepository = deps.usersRepository;
  }

  async execute(
    params: ListRecordsDTO,
    paginatedParams?: PaginatedParams<Record>
  ): Promise<ListRecordsResultDTO> {
    if (!params.userId) throw new ValidatorError(`"userId" field is required`);
    const user = await this.usersRepository.findOne({ id: params.userId });
    if (!user) throw new NotFoundError("User not found");

    if (params.operationType) {
      return this.recordsRepository.findAllByOperationType(
        params.operationType,
        {
          userId: user.id,
          isDeleted: false,
        },
        paginatedParams
      );
    }

    return this.recordsRepository.findAll(
      {
        userId: user.id,
        isDeleted: false,
      },
      paginatedParams
    );
  }
}
