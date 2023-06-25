import { OperationType } from "@/core/entities/Operation";
import OperationImpl from "./operations/OperationImpl";
import OperationAdditionImpl from "./operations/OperationAdditionImpl";
import OperationDivisionImpl from "./operations/OperationDivisionImpl";
import OperationMultiplyImpl from "./operations/OperationMultiplyImpl";
import OperationRandomStringGeneratorImpl from "./operations/OperationRandomStringGeneratorImpl";
import OperationSquareRootImpl from "./operations/OperationSquareRootImpl";
import OperationSubstractImpl from "./operations/OperationSubstractImpl";
import RandomORGOperationRandomString from "./operations/RandomORGOperationRandomStringImpl";

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
      case OperationType.RANDOM_STRING_V2:
        return new RandomORGOperationRandomString();
      case OperationType.SQUARE_ROOT:
        return new OperationSquareRootImpl();
      case OperationType.SUBTRACTION:
        return new OperationSubstractImpl();
      default:
        throw new Error("Operation type not supported");
    }
  }
}
