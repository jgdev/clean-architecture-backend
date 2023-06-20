export enum ErrorCode {
  NotFound = "E_NOT_FOUND",
  InternalError = "E_INTERNAL_SERVER",
  NotAuthenticated = "E_NO_AUTHENTICATION_PROVIDED",
  OperationNotPermitted = "E_OPERATION_DENIED",
  ValidationFailed = "E_BAD_REQUEST",
}

export enum ErrorType {
  Internal = "internal_error",
  Validation = "validation_error",
  Authorization = "authorization_error",
  InvalidPermissions = "invalid_permissions",
  Custom = "custom_error",
}

export interface IErrorParams {
  message: string;
  code?: number;
  codeType?: string;
  type?: string;
  data?: any;
  detail?: any;
  field?: string;
}

export type ErrorParams = IErrorParams | string;

export { default as BaseError } from "./BaseError";
