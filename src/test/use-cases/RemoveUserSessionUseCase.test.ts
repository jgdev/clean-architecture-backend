import User from "@/core/entities/User";
import ICacheRepository from "@/core/repository/CacheRepository";
import IEntityRepository from "@/core/repository/EntityRepository";
import RemoveUserSessionUseCase from "@/core/use-cases/RemoveUserSessionUseCase";
import createInMemoryRepository from "../utils/InMemoryRepository";
import { createInMemoryCacheRepository } from "../utils/InMemoryCacheRepository";
import { randomUUID } from "crypto";

describe("UseCase - CreateUserSession", () => {
  let removeUserSessionUseCase: RemoveUserSessionUseCase;
  let usersRepository: IEntityRepository<User>;
  let cacheRepository: ICacheRepository;

  beforeEach(async () => {
    usersRepository = createInMemoryRepository<User>();
    cacheRepository = createInMemoryCacheRepository();
    removeUserSessionUseCase = new RemoveUserSessionUseCase({
      usersRepository,
      cacheRepository,
    });
  });

  test("should remove a session id properly", async () => {
    const sessionToRemove = randomUUID();
    await cacheRepository.set(`session-test@test`, [
      randomUUID(),
      sessionToRemove,
      randomUUID(),
    ]);
    await removeUserSessionUseCase.execute({
      sessionId: sessionToRemove,
      email: "test@test",
    });
    const sessions = await cacheRepository.get<string[]>(
      `session-test@test`,
      []
    );
    expect(sessions.length).toBe(2);
    expect(sessions.includes(sessionToRemove)).toBe(false);
  });

  test("should validate fields", async () => {
    expect.assertions(3);
    try {
      await removeUserSessionUseCase.execute({
        sessionId: "",
        email: "test@test",
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid parameter sessionId/);
    }
    try {
      await removeUserSessionUseCase.execute({
        sessionId: randomUUID(),
        email: "",
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid parameter email/);
    }
    try {
      await removeUserSessionUseCase.execute({
        sessionId: randomUUID(),
        email: "test",
      });
    } catch (err: any) {
      expect(err.message).toMatch(/Invalid parameter email/);
    }
  });
});
