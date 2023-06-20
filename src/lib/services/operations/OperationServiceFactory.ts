import { OperationType } from "@/core/entities/Operation";
import OperationImpl from "./OperationImpl";
import OperationAdditionImpl from "./OperationAdditionImpl";
import OperationDivisionImpl from "./OperationDivisionImpl";
import OperationMultiplyImpl from "./OperationMultiplyImpl";
import OperationRandomStringGeneratorImpl from "./OperationRandomStringGeneratorImpl";
import OperationSquareRootImpl from "./OperationSquareRootImpl";
import OperationSubstractImpl from "./OperationSubstractImpl";

export default class OperationServiceFactory {
  static getOperationByType(
    operationType: OperationType
  ): OperationImpl | never {
    switch (operationType) {
      case OperationType.ADDITION:
        return new OperationAdditionImpl();
      case OperationType.DIVISION:
        return new OperationDivisionImpl();
      case OperationType.MULTIPLICATION:
        return new OperationMultiplyImpl();
      case OperationType.RANDOM_STRING:
        return new OperationRandomStringGeneratorImpl();
      case OperationType.SQUARE_ROOT:
        return new OperationSquareRootImpl();
      case OperationType.SUBSTRACTION:
        return new OperationSubstractImpl();
      default:
        throw new Error("Operation type not supported");
    }
  }
}
