import { randomUUID } from "crypto";

import User, { UserStatus } from "@/core/entities/User";
import ICacheRepository from "@/core/repository/CacheRepository";
import IEntityRepository from "@/core/repository/EntityRepository";
import CreateUserSessionUseCase from "@/core/use-cases/CreateUserSessionUseCase";
import SessionService from "@/core/services/auth/SessionService";

import createInMemoryRepository from "../utils/InMemoryRepository";
import createInMemoryCacheRepository from "../utils/InMemoryCacheRepository";

describe("UseCase - CreateUserSession", () => {
  let createUserSessionUseCase: CreateUserSessionUseCase;
  let usersRepository: IEntityRepository<User>;
  let cacheRepository: ICacheRepository;
  let fakeUser: User;
  let fakePassword = "test123";

  beforeEach(async () => {
    fakeUser = new User({
      email: "test@test",
      balance: 200,
      status: UserStatus.ACTIVE,
    });
    await fakeUser.setPassword(fakePassword);
    usersRepository = createInMemoryRepository<User>([fakeUser]);
    cacheRepository = createInMemoryCacheRepository();
    createUserSessionUseCase = new CreateUserSessionUseCase({
      usersRepository,
      cacheRepository,
    });
    jest.clearAllMocks();
  });

  test("should generate a session id with the given credentials", async () => {
    const expectedResult = randomUUID();
    jest
      .spyOn(SessionService.prototype, "createSession")
      .mockImplementation(() => Promise.resolve(expectedResult));
    const sessionId = await createUserSessionUseCase.execute({
      email: fakeUser.email,
      password: fakePassword,
    });
    expect(sessionId).toBe(expectedResult);
  });

  test("should throw an error if the email and password doesn't match", async () => {
    expect.assertions(1);
    try {
      await createUserSessionUseCase.execute({
        email: fakeUser.email,
        password: "testFakePassword",
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid user credentials/);
    }
  });

  test("should validate fields", async () => {
    expect.assertions(3);
    try {
      await createUserSessionUseCase.execute({
        email: "",
        password: "",
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid parameter email/);
    }
    try {
      await createUserSessionUseCase.execute({
        email: "test",
        password: "",
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid parameter email/);
    }
    try {
      await createUserSessionUseCase.execute({
        email: fakeUser.email,
        password: "",
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid parameter password/);
    }
  });
});
