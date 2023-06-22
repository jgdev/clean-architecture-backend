import User, { UserStatus } from "@/core/entities/User";
import AuthorizationError from "@/core/errors/AuthorizationError";
import ICacheRepository from "@/core/repository/CacheRepository";
import IEntityRepository from "@/core/repository/EntityRepository";
import { randomUUID } from "crypto";

export type SessionById = {
  [key: string]: { userId: string; email: string; createdAt: number };
};

export default class SessionService {
  private cacheRepository: ICacheRepository;
  private usersRepository: IEntityRepository<User>;
  static USER_SESSION_LIMIT: number = 10;

  constructor(deps: {
    cacheRepository: ICacheRepository;
    usersRepository: IEntityRepository<User>;
  }) {
    this.cacheRepository = deps.cacheRepository;
    this.usersRepository = deps.usersRepository;
  }

  async createSession(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (!user) throw new Error("User not found");
    const sessionId = randomUUID();
    let sessions = await this.cacheRepository.get<SessionById>(
      `session-${email}`,
      {}
    );
    const sessionKeys = Object.keys(sessions);
    if (sessionKeys.length >= SessionService.USER_SESSION_LIMIT) {
      const toRemove = sessionKeys[0];
      sessions = await this.removeSession(email, toRemove);
    }
    sessions[sessionId] = { userId: user!.id, email, createdAt: Date.now() };
    await this.cacheRepository.set(`session-${sessionId}`, sessions[sessionId]);
    await this.cacheRepository.set(`session-${email}`, sessions);
    return sessionId;
  }

  async removeSession(email: string, sessionId: string): Promise<SessionById> {
    const sessions = await this.cacheRepository.get<SessionById>(
      `session-${email}`,
      {}
    );
    const newSessions = Object.keys(sessions)
      .filter((id) => id !== sessionId)
      .reduce((result, sessionId) => {
        return { ...result, [sessionId]: sessions[sessionId] };
      }, {});
    await this.cacheRepository.set(`session-${email}`, newSessions);
    await this.cacheRepository.remove(`session-${sessionId}`);
    return newSessions;
  }

  async getUserBySessionId(sessionId: string): Promise<User> {
    const session = await this.cacheRepository.get<{
      email: string;
      userId: string;
    }>(`session-${sessionId}`);
    if (!session) throw new AuthorizationError("Invalid or expired session");
    const user = await this.usersRepository.findOne({ id: session.userId });
    if (!user || user.status !== UserStatus.ACTIVE)
      throw new AuthorizationError("Invalid user state");
    return user;
  }
}
