import { randomUUID } from "crypto";

export default class Record {
  readonly id: string;
  amount!: number;
  operationId!: string;
  userId!: string;
  oldUserBalance!: number;
  newUserBalance!: number;
  operationArgs!: object;
  operationResult!: any;
  timestamp!: number;

  constructor(record: Omit<Record, "id">, id?: string) {
    Object.assign(this, record);
    this.id = id || randomUUID();
  }
}
