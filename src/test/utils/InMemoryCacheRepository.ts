import ICacheRepository from "@/core/repository/CacheRepository";

export type TestCacheRecord = {
  [key: string]: { value: string; key: string; expires?: number };
};

export type ITestCacherepository = ICacheRepository & {
  records: TestCacheRecord;
};

export const createInMemoryCacheRepository =
  (initialValue?: {}): ITestCacherepository => {
    let records: TestCacheRecord = initialValue || {};

    const get = async <T = unknown>(key: string, defaultValue?: T) => {
      return (records[key]?.value || defaultValue) as T;
    };

    const set = async (key: string, value: any, expires?: number) => {
      records[key] = { key, value, expires };
    };

    const remove = async (key: string) => {
      delete records[key];
    };

    return {
      get,
      set,
      remove,
      records,
    };
  };
