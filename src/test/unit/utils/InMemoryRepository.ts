import Operation, { OperationType } from '@/core/entities/Operation';
import Record from '@/core/entities/Record';
import {
  SearchParams,
  PaginatedParams,
  PaginatedResult,
  DEFAULT_ROWS_LIMIT
} from '@/core/repository';
import IEntityRepository from '@/core/repository/EntityRepository';
import IRecordEntityRepository from '@/core/repository/RecordRepository';

export type ITestEntityRepository<T> = IEntityRepository<T> & {
  records: T[];
};

export const createInMemoryRepository = <T>(
  initialData: T[] = []
): ITestEntityRepository<T> => {
  let records: T[] = initialData;

  const findByParams = (params?: SearchParams<T>) => (record: any) => {
    return Object.keys(params || {}).reduce((result, key: any) => {
      return result && record[key] === (params as any)[key];
    }, true);
  };

  const create = async (params: Partial<T>) => {
    records.push(params as T);
    return params as T;
  };

  const findOne = async (params: SearchParams<T>) => {
    return records.find(findByParams(params));
  };

  const findAll = async (
    searchParams?: SearchParams<T>,
    paginatedParams?: PaginatedParams<T>
  ) => {
    const skip = paginatedParams?.skip || 0;
    const limit = paginatedParams?.limit || DEFAULT_ROWS_LIMIT;
    let data = records.filter(findByParams(searchParams));
    if (paginatedParams?.orderBy) {
      const orderBy = paginatedParams.orderBy;
      data = data.sort((a: any, b: any) => {
        if (a[orderBy] > b[orderBy]) {
          return paginatedParams.sortBy === 'asc' ? 1 : -1;
        } else {
          return paginatedParams.sortBy === 'asc' ? -1 : 1;
        }
      });
    }
    const result = data.slice(skip, skip + limit);
    return {
      ...paginatedParams,
      total: data.length,
      limit,
      result,
      skip
    } as PaginatedResult<T>;
  };

  const update = async (params: SearchParams<T>, toUpdate: Partial<T>) => {
    const recordIndex = records.findIndex(findByParams(params));
    if (recordIndex > -1) {
      records[recordIndex] = {
        ...records[recordIndex],
        ...toUpdate
      };
    }
    return records[recordIndex];
  };

  const remove = async (params: SearchParams<T>) => {
    const recordIndex = records.findIndex(findByParams(params));
    if (recordIndex > -1) {
      records = records.splice(recordIndex, 1);
    }
  };

  const repository: IEntityRepository<T> = {
    create,
    findOne,
    findAll,
    remove,
    update
  };

  return { ...repository, records };
};

export const createInMemoryRecordEntityRepository = (
  operationsRepository: IEntityRepository<Operation>,
  initialData: Record[] = []
): IRecordEntityRepository => {
  const testOperationRepository =
    operationsRepository as ITestEntityRepository<Operation>;
  const entityRepository = createInMemoryRepository<Record>(initialData);
  const findAllByOperationType = (
    operationType?: OperationType,
    searchParams?: SearchParams<Record>,
    paginatedParams?: PaginatedParams<Record>
  ): Promise<PaginatedResult<Record>> => {
    const operation = testOperationRepository.records.find(
      (operation) => operation.type === operationType
    );

    return entityRepository.findAll(
      {
        ...((searchParams as any) || {}),
        operationId: operation?.id
      },
      paginatedParams
    );
  };
  return {
    ...entityRepository,
    findAllByOperationType
  } as IRecordEntityRepository;
};

export default createInMemoryRepository;
