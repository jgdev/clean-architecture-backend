import { randomUUID } from "crypto";

import User, { UserStatus } from "@/core/entities/User";
import ICacheRepository from "@/core/repository/CacheRepository";
import IEntityRepository from "@/core/repository/EntityRepository";
import SessionService, {
  SessionById,
} from "@/core/services/auth/SessionService";

import createInMemoryRepository from "../utils/InMemoryRepository";
import { createInMemoryCacheRepository } from "../utils/InMemoryCacheRepository";

describe("Service - SessionService", () => {
  let usersRepository: IEntityRepository<User>;
  let cacheRepository: ICacheRepository;
  let sessionService: SessionService;

  let fakeUser: User;

  beforeEach(() => {
    fakeUser = new User({
      email: "test@test",
      balance: 0,
      status: UserStatus.ACTIVE,
    });
    usersRepository = createInMemoryRepository<User>([fakeUser]);
    cacheRepository = createInMemoryCacheRepository();
    sessionService = new SessionService({
      usersRepository,
      cacheRepository,
    });
  });

  test("should generate a session for a given email", async () => {
    const email = fakeUser.email;
    expect(await cacheRepository.get<SessionById>(`session-${email}`)).toBe(
      undefined
    );
    const sessionId = await sessionService.createSession(email);
    const sessions = await cacheRepository.get<SessionById>(
      `session-${fakeUser.email}`,
      {}
    );
    expect(Object.keys(sessions).includes(sessionId)).toBe(true);
  });

  test("should expire an old session if the user reaches the maximum session limit per user", async () => {
    const userId = fakeUser.id;
    const email = fakeUser.email;
    await cacheRepository.set(`session-${email}`, {
      [randomUUID()]: { userId, email },
      [randomUUID()]: { userId, email },
      [randomUUID()]: { userId, email },
    });
    const sessionId = await sessionService.createSession(email);
    const sessions = await cacheRepository.get<SessionById>(
      `session-${email}`,
      {}
    );
    expect(Object.keys(sessions).length).toBe(3);
    expect(Object.keys(sessions).includes(sessionId)).toBe(true);
  });

  test("should remove a session id properly", async () => {
    const sessionToRemove = randomUUID();
    const userId = fakeUser.id;
    const email = fakeUser.email;
    await cacheRepository.set(`session-${email}`, {
      [randomUUID()]: { userId, email },
      [sessionToRemove]: { userId, email },
      [randomUUID()]: { userId, email },
    });
    await sessionService.removeSession(email, sessionToRemove);
    const sessions = await cacheRepository.get<SessionById>(
      `session-${email}`,
      {}
    );

    expect(Object.keys(sessions).length).toBe(2);
    expect(Object.keys(sessions).includes(sessionToRemove)).toBe(false);
  });
});
