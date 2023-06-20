import Record from "@/core/entities/Record";
import { OperationType } from "@/core/entities/Operation";
import IEntityRepository from "./EntityRepository";
import { PaginatedParams, PaginatedResult, SearchParams } from ".";

export default interface IRecordEntityRepository
  extends IEntityRepository<Record> {
  findAllByOperationType: (
    operationType: OperationType,
    searchParams?: SearchParams<Record>,
    params?: PaginatedParams<Record>
  ) => Promise<PaginatedResult<Record>>;
}
