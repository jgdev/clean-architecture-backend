import User, { UserStatus } from "@/core/entities/User";
import IEntityRepository from "@/core/repository/EntityRepository";
import ICacheRepository from "@/core/repository/CacheRepository";
import { isValidEmail } from "@/core/utils/validation";
import ValidatorError from "@/core/errors/ValidationError";
import AuthorizationError from "@/core/errors/AuthorizationError";
import SessionService from "@/core/services/auth/SessionService";

export type CreateUserSessionDTO = {
  email: string;
  password: string;
};

export default class CreateUserSessionUseCase {
  private usersRepository: IEntityRepository<User>;
  private cacheRepository: ICacheRepository;

  constructor(deps: {
    usersRepository: IEntityRepository<User>;
    cacheRepository: ICacheRepository;
  }) {
    this.usersRepository = deps.usersRepository;
    this.cacheRepository = deps.cacheRepository;
  }

  async execute(params: CreateUserSessionDTO): Promise<string> {
    const sessionService = new SessionService({
      cacheRepository: this.cacheRepository,
      usersRepository: this.usersRepository,
    });
    if (!params.email || !isValidEmail(params.email))
      throw new ValidatorError("Invalid parameter email");
    if (!params.password)
      throw new ValidatorError("Invalid parameter password");
    const user = await this.usersRepository.findOne({
      email: params.email,
      status: UserStatus.ACTIVE,
    });
    let invalidCredentials = !user;
    if (user) invalidCredentials = !(await user.validateUser(params.password));
    if (invalidCredentials) {
      throw new AuthorizationError("Invalid user credentials");
    }
    return sessionService.createSession(params.email);
  }
}
