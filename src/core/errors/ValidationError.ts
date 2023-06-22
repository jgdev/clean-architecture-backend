import { BaseError, ErrorParams, ErrorType } from ".";

export default class ValidatorError extends BaseError {
  constructor(params: ErrorParams) {
    super(params);
    this.name = "ValidatorError";
    this.type = ErrorType.Validation;
    this.data = { displayError: true };
  }
}
