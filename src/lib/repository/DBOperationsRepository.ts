import {
  PrismaClient,
  Operation as PrismaOperation,
  Prisma
} from '@prisma/client';
import Operation, { OperationType } from '@/core/entities/Operation';
import {
  SearchParams,
  PaginatedParams,
  PaginatedResult,
  DEFAULT_ROWS_LIMIT
} from '@/core/repository';

import IEntityRepository from '@/core/repository/EntityRepository';

export const modelToDbObject = (operation: Operation): PrismaOperation => ({
  cost: new Prisma.Decimal(operation.cost),
  id: operation.id,
  type: operation.type
});

export const dbObjectToModel = (dbObject: PrismaOperation): Operation =>
  new Operation(
    {
      cost: dbObject.cost.toNumber(),
      type: dbObject.type as OperationType
    },
    dbObject.id
  );

export default class DBOperationsRepository
  implements IEntityRepository<Operation>
{
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async create(params: Partial<Operation>): Promise<Operation> {
    const data = await this.client.operation.create({
      data: modelToDbObject(params as Operation)
    });
    return dbObjectToModel(data);
  }

  async findAll(
    searchParams?: SearchParams<Operation> | undefined,
    paginatedParams?: PaginatedParams<Operation> | undefined
  ): Promise<PaginatedResult<Operation>> {
    const results = await this.client.$transaction([
      this.client.operation.count({
        where: searchParams
      }),
      this.client.operation.findMany({
        where: searchParams,
        skip: paginatedParams?.skip,
        take: paginatedParams?.limit,
        orderBy: paginatedParams?.orderBy && {
          [paginatedParams?.orderBy]: paginatedParams?.sortBy || 'desc'
        }
      })
    ]);

    return {
      total: results[0],
      result: results[1].map(dbObjectToModel),
      skip: paginatedParams?.skip || 0,
      limit: paginatedParams?.limit || DEFAULT_ROWS_LIMIT,
      orderBy: paginatedParams?.orderBy,
      sortBy: paginatedParams?.sortBy
    };
  }

  async findOne(
    params: SearchParams<Operation>
  ): Promise<Operation | undefined> {
    const result = await this.client.operation.findFirst({
      where: params
    });
    return (result && dbObjectToModel(result)) || undefined;
  }

  async remove(params: SearchParams<Operation>): Promise<void> {
    await this.client.operation.delete({
      where: params
    });
  }

  async update(
    params: SearchParams<Operation>,
    updateParams: Partial<Operation>
  ): Promise<Operation> {
    const result = await this.client.operation.update({
      where: params,
      data: updateParams
    });
    return dbObjectToModel(result);
  }
}
