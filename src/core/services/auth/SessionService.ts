import User from "@/core/entities/User";
import ICacheRepository from "@/core/repository/CacheRepository";
import IEntityRepository from "@/core/repository/EntityRepository";
import { randomUUID } from "crypto";

export default class SessionService {
  private cacheRepository: ICacheRepository;
  private usersRepository: IEntityRepository<User>;
  constructor(deps: {
    cacheRepository: ICacheRepository;
    usersRepository: IEntityRepository<User>;
  }) {
    this.cacheRepository = deps.cacheRepository;
    this.usersRepository = deps.usersRepository;
  }
  async createSession(email: string) {
    const sessionId = randomUUID();
    let sessions = await this.cacheRepository.get<string[]>(
      `session-${email}`,
      []
    );
    if (sessions.length > 2) {
      sessions = [sessionId, ...sessions.slice(1, 3)];
    } else {
      sessions.push(sessionId);
    }
    await this.cacheRepository.set(`session-${email}`, sessions);
    return sessionId;
  }
  async removeSession(email: string, sessionId: string) {
    const sessions = await this.cacheRepository.get<string[]>(
      `session-${email}`,
      []
    );
    await this.cacheRepository.set(
      `session-${email}`,
      sessions.filter((id) => id !== sessionId)
    );
  }
}
