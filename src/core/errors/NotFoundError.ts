import { BaseError, ErrorParams, ErrorType } from ".";

export default class NotFoundError extends BaseError {
  constructor(params: ErrorParams) {
    super(params);
    this.name = "NotFound";
    this.type = ErrorType.Custom;
  }
}
