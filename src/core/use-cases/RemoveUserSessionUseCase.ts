import User from "@/core/entities/User";
import IEntityRepository from "@/core/repository/EntityRepository";
import ICacheRepository from "@/core/repository/CacheRepository";
import SessionService from "@/core/services/auth/SessionService";

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

  async execute(params: RemoveUserSessionDTO): Promise<void> {
    const sessionService = new SessionService({
      cacheRepository: this.cacheRepository,
      usersRepository: this.usersRepository,
    });
    if (!params.email || !isValidEmail(params.email))
      throw new ValidatorError("Invalid parameter email");
    if (!params.sessionId)
      throw new ValidatorError("Invalid parameter sessionId");
    await sessionService.removeSession(params.email, params.sessionId);
  }
}
