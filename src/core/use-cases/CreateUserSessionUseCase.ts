import User, { UserStatus } from "@/core/entities/User";
import IEntityRepository from "@/core/repository/EntityRepository";
import ICacheRepository from "@/core/repository/CacheRepository";
import { isValidEmail } from "@/core/utils/validation";
import ValidatorError from "../errors/ValidationError";
import AuthorizationError from "../errors/AuthorizationError";
import { randomUUID } from "crypto";

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

    const sessionId = randomUUID();
    let sessions = await this.cacheRepository.get<string[]>(
      `session-${params.email}`,
      []
    );
    if (sessions.length > 2) {
      sessions = [sessionId, ...sessions.slice(1, 3)];
    } else {
      sessions.push(sessionId);
    }
    await this.cacheRepository.set(`session-${params.email}`, sessions);
    return sessionId;
  }
}
