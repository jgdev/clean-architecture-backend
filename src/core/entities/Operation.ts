import { randomUUID } from "crypto";

export enum OperationType {
  ADDITION = "addition",
  SUBSTRACTION = "substraction",
  MULTIPLICATION = "multiplication",
  DIVISION = "division",
  SQUARE_ROOT = "square_root",
  RANDOM_STRING = "random_string",
  RANDOM_STRING_V2 = "random_string_v2",
}

export default class Operation {
  readonly id!: string;
  type!: OperationType;
  cost!: number;

  constructor(operation: Omit<Operation, "id">, id?: string) {
    Object.assign(this, operation);
    this.id = id || randomUUID();
  }
}
