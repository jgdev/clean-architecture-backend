import User, { UserStatus } from "@/core/entities/User";
import ICacheRepository from "@/core/repository/CacheRepository";
import IEntityRepository from "@/core/repository/EntityRepository";
import CreateUserSessionUseCase from "@/core/use-cases/CreateUserSessionUseCase";
import createInMemoryRepository from "../utils/InMemoryRepository";
import { createInMemoryCacheRepository } from "../utils/InMemoryCacheRepository";
import { randomUUID } from "crypto";

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
  });

  test("should generate a session id with the given credentials", async () => {
    expect(
      await cacheRepository.get<string[]>(`session-${fakeUser.email}`)
    ).toBe(undefined);
    const sessionId = await createUserSessionUseCase.execute({
      email: fakeUser.email,
      password: fakeUser.password,
    });
    const sessions = await cacheRepository.get<string[]>(
      `session-${fakeUser.email}`,
      []
    );
    expect(sessions[0]).toMatch(
      /^[0-9(a-f|A-F)]{8}-[0-9(a-f|A-F)]{4}-4[0-9(a-f|A-F)]{3}-[89ab][0-9(a-f|A-F)]{3}-[0-9(a-f|A-F)]{12}$/gim
    );
    expect(sessionId).toBe(sessions[0]);
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

  test("should expire an old session if the user reaches the maximum session limit per user", async () => {
    await cacheRepository.set(`session-${fakeUser.email}`, [
      randomUUID(),
      randomUUID(),
      randomUUID(),
    ]);
    const sessionId = await createUserSessionUseCase.execute({
      email: fakeUser.email,
      password: fakeUser.password,
    });
    const sessions = await cacheRepository.get<string[]>(
      `session-${fakeUser.email}`,
      []
    );
    expect(sessions[0]).toMatch(
      /^[0-9(a-f|A-F)]{8}-[0-9(a-f|A-F)]{4}-4[0-9(a-f|A-F)]{3}-[89ab][0-9(a-f|A-F)]{3}-[0-9(a-f|A-F)]{12}$/gim
    );
    expect(sessionId).toBe(sessions[0]);
  });
});
