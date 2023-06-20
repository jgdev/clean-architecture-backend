import OperationImpl from "./OperationImpl";

export default class OperationAdditionImpl implements OperationImpl {
  async perform(args: any[]): Promise<number> {
    return 0;
  }
}
