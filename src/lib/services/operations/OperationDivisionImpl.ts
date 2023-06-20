import OperationImpl from "./OperationImpl";

export default class OperationDivisionImpl implements OperationImpl {
  async perform(args: any[]): Promise<number> {
    return 0;
  }
}
