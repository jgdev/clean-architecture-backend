import {
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisScripts,
} from "redis";
import ICacheRepository from "@/core/repository/CacheRepository";

export default class RedisCacheRepository implements ICacheRepository {
  private client: RedisClientType<
    RedisDefaultModules,
    RedisFunctions,
    RedisScripts
  >;

  constructor(
    client: RedisClientType<RedisDefaultModules, RedisFunctions, RedisScripts>
  ) {
    this.client = client;
  }

  async get<T>(key: string, defaultValue?: T | undefined) {
    const result =
      ((await this.client.json.get(key)) as T) || (defaultValue as T);
    return result;
  }

  async set(key: string, value: any) {
    await this.client.json.set(key, ".", value);
  }

  async remove(key: string) {
    await this.client.json.del(key);
  }
}
