import { MapTo } from "@xneunoro/neucore";
import { ApiError } from "../common/ApiError";
import { ErrorCode } from "./ErrorCodes";

export abstract class AppException<T = unknown> extends Error {
  constructor(
    public readonly message: string,
    public readonly code: ErrorCode,
    public readonly statusCode: number = 400,
    public readonly details?: T,
  ) {
    super(message);
    this.name = this.constructor.name;
    // Esto es necesario para capturar correctamente la pila de llamadas en V8 (Node.js)
    Error.captureStackTrace(this, this.constructor);
  }

  @MapTo(ApiError)
  public toApiError(): ApiError<T> {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }
}
