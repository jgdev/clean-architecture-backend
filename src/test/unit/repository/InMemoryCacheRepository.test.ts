import { createInMemoryCacheRepository } from "../utils/InMemoryCacheRepository";

describe("InMemoryCacheRepository", () => {
  test("should set an entry cache", async () => {
    const cacheRepository = createInMemoryCacheRepository({});
    expect(cacheRepository.records).toMatchObject({});
    await cacheRepository.set("hello", "world");
    expect(cacheRepository.records).toMatchObject({
      hello: { key: "hello", value: "world" },
    });
  });

  test("should replace an entry cache", async () => {
    const cacheRepository = createInMemoryCacheRepository({
      hello: { key: "hello", value: "world" },
    });
    await cacheRepository.set("hello", "foo-bar");
    expect(cacheRepository.records).toMatchObject({
      hello: { key: "hello", value: "foo-bar" },
    });
  });

  test("should get an entry cache", async () => {
    const cacheRepository = createInMemoryCacheRepository({
      hello: { key: "hello", value: "foo-bar" },
    });
    const result = await cacheRepository.get("hello");
    expect(result).toBe("foo-bar");
  });

  test("should remove an entry cache", async () => {
    const cacheRepository = createInMemoryCacheRepository({
      hello: { key: "hello", value: "foo-bar" },
    });
    let result = await cacheRepository.get("hello");
    expect(result).toBe("foo-bar");
    await cacheRepository.remove("hello");
    result = await cacheRepository.get("hello");
    expect(result).toBe(undefined);
  });
});
