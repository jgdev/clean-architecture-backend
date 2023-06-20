import { BaseError, ErrorParams, ErrorType } from ".";

export default class AuthorizationError extends BaseError {
  constructor(params: ErrorParams) {
    super(params);
    this.name = "AuthorizationError";
    this.type = ErrorType.Authorization;
  }
}
