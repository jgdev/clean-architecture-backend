import OperationImpl from "./OperationImpl";

export default class OperationSubstractImpl implements OperationImpl {
  async perform(args: any[]): Promise<number> {
    return 0;
  }
}
