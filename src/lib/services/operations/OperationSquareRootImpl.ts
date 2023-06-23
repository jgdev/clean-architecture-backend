import ValidatorError from "@/core/errors/ValidationError";
import OperationImpl from "./OperationImpl";

export default class OperationSquareRootImpl implements OperationImpl {
  async perform(args: any[]): Promise<number> {
    if (args.length < 1 || isNaN(Number(args[0])))
      throw new ValidatorError("Expecting one numeric argument");
    return Math.sqrt(args[0]);
  }
}
