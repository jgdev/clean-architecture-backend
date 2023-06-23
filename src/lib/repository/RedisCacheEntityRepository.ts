import ICacheRepository from '@/core/repository/CacheRepository';

export default class RedisCacheEntityRepository implements ICacheRepository {
  async get<T>(key: string, defaultValue?: T | undefined) {
    return {} as T;
  }

  async set(key: string, value: any) {}

  async remove(key: string) {}
}
