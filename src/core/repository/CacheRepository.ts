export default interface ICacheRepository {
  get: <T = unknown>(key: string, defaultValue?: T | undefined) => Promise<T>;
  set: (key: string, value: any) => Promise<void>;
  remove: (key: string) => Promise<void>;
}
