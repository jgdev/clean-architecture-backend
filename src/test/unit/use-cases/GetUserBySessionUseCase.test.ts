import ICacheRepository from "@/core/repository/CacheRepository";
import IEntityRepository from "@/core/repository/EntityRepository";
import GetUserBySessionUseCase from "@/core/use-cases/GetUserBySessionUseCase";
import createInMemoryRepository from "../utils/InMemoryRepository";
import createInMemoryCacheRepository from "../utils/InMemoryCacheRepository";
import User, { UserStatus } from "@/core/entities/User";
import SessionService from "@/core/services/auth/SessionService";

describe("Use Case - GetUserBySession", () => {
  let getUserBySessionUseCase: GetUserBySessionUseCase;
  let usersRepository: IEntityRepository<User>;
  let cacheRepository: ICacheRepository;
  let sessionService: SessionService;
  let fakeUser: User;

  beforeEach(() => {
    fakeUser = new User({
      email: "test@test",
      balance: 200,
      status: UserStatus.ACTIVE,
    });
    usersRepository = createInMemoryRepository<User>([fakeUser]);
    cacheRepository = createInMemoryCacheRepository();
    sessionService = new SessionService({
      cacheRepository,
      usersRepository,
    });
    getUserBySessionUseCase = new GetUserBySessionUseCase({
      sessionService,
    });
  });

  test("should return an user using the sessionId", async () => {
    const sessionId = await sessionService.createSession(fakeUser.email);
    expect(await getUserBySessionUseCase.execute({ sessionId })).toMatchObject({
      user: fakeUser,
    });
  });
});
