import Operation from "@/core/entities/Operation";
import IEntityRepository from "@/core/repository/EntityRepository";
import { PaginatedResult, PaginatedParams } from "../repository";

export type ListOperationsDTO = PaginatedResult<Operation>;

export default class ListOperaitonsUseCase {
  private operationsRepository: IEntityRepository<Operation>;

  constructor(deps: { operationsRepository: IEntityRepository<Operation> }) {
    this.operationsRepository = deps.operationsRepository;
  }

  async execute(
    paginatedParams?: PaginatedParams<Operation>
  ): Promise<ListOperationsDTO> {
    const result = await this.operationsRepository.findAll({}, paginatedParams);
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
}
