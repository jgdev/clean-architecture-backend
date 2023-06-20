import User from "@/core/entities/User";
import ValidatorError from "@/core/errors/ValidationError";
import NotFoundError from "@/core/errors/NotFoundError";
import IEntityRepository from "@/core/repository/EntityRepository";
import IRecordEntityRepository from "@/core/repository/RecordRepository";

export type RemoveRecordDTO = {
  userId: string;
  recordId: string;
};
export type RemoveRecordResultDTO = void;

export default class RemoveRecordUseCase {
  private recordsRepository: IRecordEntityRepository;
  private usersRepository: IEntityRepository<User>;

  constructor(deps: {
    recordsRepository: IRecordEntityRepository;
    usersRepository: IEntityRepository<User>;
  }) {
    this.recordsRepository = deps.recordsRepository;
    this.usersRepository = deps.usersRepository;
  }

  async execute(params: RemoveRecordDTO): Promise<RemoveRecordResultDTO> {
    if (!params.userId) throw new ValidatorError("Invalid parameter userId");
    const user = await this.usersRepository.findOne({ id: params.userId });
    if (!user) throw new NotFoundError("User not found");

    if (!params.recordId)
      throw new ValidatorError("Invalid parameter recordId");
    const record = await this.recordsRepository.findOne({
      id: params.recordId,
    });
    if (!record || record.userId !== user.id)
      throw new NotFoundError("Record not found");

    await this.recordsRepository.remove({
      id: params.recordId,
      userId: user.id,
    });
  }
}
