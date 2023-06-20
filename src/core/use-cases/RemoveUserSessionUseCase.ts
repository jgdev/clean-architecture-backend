import User from "@/core/entities/User";
import IEntityRepository from "@/core/repository/EntityRepository";
import ICacheRepository from "../repository/CacheRepository";
import { isValidEmail } from "../utils/validation";
import ValidatorError from "../errors/ValidationError";

export type RemoveUserSessionDTO = {
  email: string;
  sessionId: string;
};

export default class RemoveUserSessionUseCase {
  private usersRepository: IEntityRepository<User>;
  private cacheRepository: ICacheRepository;

  constructor(deps: {
    usersRepository: IEntityRepository<User>;
    cacheRepository: ICacheRepository;
  }) {
    this.usersRepository = deps.usersRepository;
    this.cacheRepository = deps.cacheRepository;
  }

  async execute(params: RemoveUserSessionDTO) {
    if (!params.email || !isValidEmail(params.email))
      throw new ValidatorError("Invalid parameter email");
    if (!params.sessionId)
      throw new ValidatorError("Invalid parameter sessionId");
    const sessions = await this.cacheRepository.get<string[]>(
      `session-${params.email}`,
      []
    );
    await this.cacheRepository.set(
      `session-${params.email}`,
      sessions.filter((id) => id !== params.sessionId)
    );
  }
}
