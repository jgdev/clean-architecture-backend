import { ErrorParams, ErrorType, IErrorParams } from ".";

export default class BaseError extends Error implements IErrorParams {
  public message: string;
  public codeType?: string;
  public detail?: any;
  public field?: string;
  public type?: string;
  public code?: number;
  public data?: any;

  constructor(params: ErrorParams) {
    if (typeof params === "string") {
      super(params);
      this.message = params;
    } else {
      const {
        message = "Internal error",
        codeType = "E_INTERNAL_ERROR",
        type = ErrorType.Internal,
        code = -1,
        data = null,
        detail = null,
        field = "",
      } = params;
      super(message);
      this.message = message;
      this.codeType = codeType;
      this.type = type;
      this.code = code;
      this.data = data;
      this.detail = detail;
      this.field = field;
    }
    this.name = "BaseError";
  }
}
