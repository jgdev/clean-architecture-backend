import { PaginatedParams, PaginatedResult, SearchParams } from ".";

export default interface IEntityRepository<T> {
  findOne: (params: SearchParams<T>) => Promise<T | undefined>;
  findAll: (
    searchParams: SearchParams<T>,
    paginatedParams?: PaginatedParams<T>
  ) => Promise<PaginatedResult<T>>;
  create: (params: Partial<T>) => Promise<T>;
  update: (params: SearchParams<T>, updateParams: Partial<T>) => Promise<T>;
  remove: (params: SearchParams<T>) => Promise<void>;
}
