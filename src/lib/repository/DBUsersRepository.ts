import { PrismaClient, User as PrismaUser, Prisma } from '@prisma/client';
import User, { UserStatus } from '@/core/entities/User';
import {
  SearchParams,
  PaginatedParams,
  PaginatedResult,
  DEFAULT_ROWS_LIMIT
} from '@/core/repository';

import IEntityRepository from '@/core/repository/EntityRepository';

export const modelToDbObject = (user: User): PrismaUser => ({
  id: user.id,
  email: user.email,
  balance: new Prisma.Decimal(user.balance),
  password: user.password || '',
  status: user.status
});

export const dbObjectToModel = (dbObject: PrismaUser): User =>
  new User(
    {
      email: dbObject.email,
      balance: dbObject.balance.toNumber(),
      status: dbObject.status as UserStatus
    },
    dbObject.id,
    dbObject.password
  );

export default class DBUsersRepository implements IEntityRepository<User> {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async create(params: Partial<User>): Promise<User> {
    const data = await this.client.user.create({
      data: modelToDbObject(params as User)
    });
    return dbObjectToModel(data);
  }

  async findAll(
    searchParams?: SearchParams<User> | undefined,
    paginatedParams?: PaginatedParams<User> | undefined
  ): Promise<PaginatedResult<User>> {
    const results = await this.client.$transaction([
      this.client.user.count({
        where: searchParams
      }),
      this.client.user.findMany({
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

  async findOne(params: SearchParams<User>): Promise<User | undefined> {
    const result = await this.client.user.findFirst({
      where: params
    });
    return (result && dbObjectToModel(result)) || undefined;
  }

  async remove(params: SearchParams<User>): Promise<void> {
    await this.client.user.delete({
      where: params
    });
  }

  async update(
    params: SearchParams<User>,
    updateParams: Partial<User>
  ): Promise<User> {
    const result = await this.client.user.update({
      where: params,
      data: updateParams
    });
    return dbObjectToModel(result);
  }
}
