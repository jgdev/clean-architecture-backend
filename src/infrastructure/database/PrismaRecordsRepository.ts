import { PrismaClient, Record as PrismaRecord, Prisma } from "@prisma/client";
import Record from "@/core/entities/Record";
import {
  SearchParams,
  PaginatedParams,
  PaginatedResult,
  DEFAULT_ROWS_LIMIT,
} from "@/core/repository";

import IRecordEntityRepository from "@/core/repository/RecordRepository";
import { OperationType } from "@/core/entities/Operation";

export type RecordDbObject = Omit<
  PrismaRecord,
  "operationArgs" | "operationResult"
> & {
  operationArgs: any[];
  operationResult: any;
};

export const modelToDbObject = (model: Record): RecordDbObject => {
  return {
    id: model.id,
    newUserBalance: new Prisma.Decimal(model.newUserBalance),
    oldUserBalance: new Prisma.Decimal(model.oldUserBalance),
    operationId: model.operationId,
    operationArgs: model.operationArgs as Prisma.JsonArray,
    operationResult: model.operationResult as Prisma.JsonObject,
    date: new Date(model.date),
    userId: model.userId,
    cost: new Prisma.Decimal(model.cost),
  };
};

export const dbObjectToModel = (dbObject: PrismaRecord): Record =>
  new Record(
    {
      newUserBalance: dbObject.newUserBalance.toNumber(),
      oldUserBalance: dbObject.oldUserBalance.toNumber(),
      operationArgs: dbObject.operationArgs as any[],
      operationResult: dbObject.operationResult as any,
      operationId: dbObject.operationId,
      date: dbObject.date,
      userId: dbObject.userId,
      cost: dbObject.cost.toNumber(),
    },
    dbObject.id
  );

export default class PrismaRecordsRepository
  implements IRecordEntityRepository
{
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async create(params: Partial<Record>): Promise<Record> {
    const data = await this.client.record.create({
      data: modelToDbObject(params as Record),
    });
    return dbObjectToModel(data);
  }

  async findAll(
    searchParams?: SearchParams<Record> | undefined,
    paginatedParams?: PaginatedParams<Record> | undefined
  ): Promise<PaginatedResult<Record>> {
    const results = await this.client.$transaction([
      this.client.record.count({
        where: searchParams,
      }),
      this.client.record.findMany({
        where: searchParams,
        skip: paginatedParams?.skip,
        take: paginatedParams?.limit,
        orderBy: paginatedParams?.orderBy && {
          [paginatedParams?.orderBy]: paginatedParams?.sortBy || "desc",
        },
      }),
    ]);

    return {
      total: results[0],
      result: results[1].map(dbObjectToModel),
      skip: paginatedParams?.skip || 0,
      limit: paginatedParams?.limit || DEFAULT_ROWS_LIMIT,
      orderBy: paginatedParams?.orderBy,
      sortBy: paginatedParams?.sortBy,
    };
  }

  async findAllByOperationType(
    operationType: OperationType,
    searchParams?: Partial<Record> | undefined,
    params?: PaginatedParams<Record> | undefined
  ): Promise<PaginatedResult<Record>> {
    const operation = await this.client.operation.findFirst({
      where: { type: operationType },
    });
    return this.findAll(
      {
        operationId: operation?.id,
        ...searchParams,
      },
      params
    );
  }

  async findOne(params: SearchParams<Record>): Promise<Record | undefined> {
    const result = await this.client.record.findFirst({
      where: params,
    });
    return (result && dbObjectToModel(result)) || undefined;
  }

  async remove(params: SearchParams<Record>): Promise<void> {
    await this.client.record.delete({
      where: params,
    });
  }

  async update(
    params: SearchParams<Record>,
    updateParams: Partial<Record>
  ): Promise<Record> {
    const result = await this.client.record.update({
      where: params,
      data: updateParams,
    });
    return dbObjectToModel(result);
  }
}
