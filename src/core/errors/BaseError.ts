import { ErrorParams, ErrorType, IErrorParams } from ".";

export default class BaseError extends Error implements IErrorParams {
  public message: string = "";
  public codeType?: ErrorType;
  public detail?: any;
  public field?: string;
  public type?: string;
  public code?: number;
  public data?: any;

  constructor(params: ErrorParams) {
    const message = typeof params === "string" ? params : params.message;
    super(message);
    this.message = message;
    this.name = "BaseError";
  }
}
