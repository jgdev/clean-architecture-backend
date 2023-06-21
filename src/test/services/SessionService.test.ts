import { randomUUID } from "crypto";

import User from "@/core/entities/User";
import ICacheRepository from "@/core/repository/CacheRepository";
import IEntityRepository from "@/core/repository/EntityRepository";
import SessionService from "@/core/services/auth/SessionService";

import createInMemoryRepository from "../utils/InMemoryRepository";
import { createInMemoryCacheRepository } from "../utils/InMemoryCacheRepository";

describe("Service - SessionService", () => {
  let usersRepository: IEntityRepository<User>;
  let cacheRepository: ICacheRepository;
  let sessionService: SessionService;

  beforeEach(() => {
    usersRepository = createInMemoryRepository<User>();
    cacheRepository = createInMemoryCacheRepository();
    sessionService = new SessionService({
      usersRepository,
      cacheRepository,
    });
  });

  test("should generate a session for a given userId", async () => {
    expect(await cacheRepository.get<string[]>(`session-test@test`)).toBe(
      undefined
    );
    const sessionId = await sessionService.createSession("test@test");
    const sessions = await cacheRepository.get<string[]>(
      `session-test@test`,
      []
    );
    expect(sessions[0]).toMatch(
      /^[0-9(a-f|A-F)]{8}-[0-9(a-f|A-F)]{4}-4[0-9(a-f|A-F)]{3}-[89ab][0-9(a-f|A-F)]{3}-[0-9(a-f|A-F)]{12}$/gim
    );
    expect(sessionId).toBe(sessions[0]);
  });

  test("should expire an old session if the user reaches the maximum session limit per user", async () => {
    await cacheRepository.set(`session-test@test`, [
      randomUUID(),
      randomUUID(),
      randomUUID(),
    ]);
    const sessionId = await sessionService.createSession("test@test");
    const sessions = await cacheRepository.get<string[]>(
      `session-test@test`,
      []
    );
    expect(sessions[0]).toMatch(
      /^[0-9(a-f|A-F)]{8}-[0-9(a-f|A-F)]{4}-4[0-9(a-f|A-F)]{3}-[89ab][0-9(a-f|A-F)]{3}-[0-9(a-f|A-F)]{12}$/gim
    );
    expect(sessionId).toBe(sessions[0]);
  });

  test("should remove a session id properly", async () => {
    const sessionToRemove = randomUUID();
    await cacheRepository.set(`session-test@test`, [
      randomUUID(),
      sessionToRemove,
      randomUUID(),
    ]);
    await sessionService.removeSession("test@test", sessionToRemove);
    const sessions = await cacheRepository.get<string[]>(
      `session-test@test`,
      []
    );
    expect(sessions.length).toBe(2);
    expect(sessions.includes(sessionToRemove)).toBe(false);
  });
});
