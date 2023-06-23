import { randomUUID } from 'crypto';

export default class Record {
  readonly id: string;
  cost!: number;
  operationId!: string;
  userId!: string;
  oldUserBalance!: number;
  newUserBalance!: number;
  operationArgs!: any;
  operationResult!: any;
  timestamp!: Date;

  constructor(record: Omit<Record, 'id'>, id?: string) {
    Object.assign(this, record);
    this.id = id || randomUUID();
  }
}
