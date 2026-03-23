import { AppException } from "./AppExceptions";
import { ErrorCode } from "./ErrorCodes";

export class BadRequestException extends AppException {
  constructor(message: string) {
    super(message, ErrorCode.BAD_REQUEST, 400);
  }
}

export class ValidationException<T = any> extends AppException<T> {
  constructor(
    details: T,
    message: string = "Se encontraron errores de validación",
  ) {
    super(message, ErrorCode.VALIDATION_ERROR, 400, details);
  }
}

export class TooManyRequestsException extends AppException {
  constructor() {
    super(
      "Has superado el límite de peticiones permitido",
      ErrorCode.TOO_MANY_REQUESTS,
      429,
    );
  }
}

export class MalformedJsonException extends AppException {
  constructor() {
    super(
      "El cuerpo de la petición no es un JSON válido",
      ErrorCode.MALFORMED_JSON,
      400,
    );
  }
}

export class TooManyAttemptsException extends AppException {
  constructor() {
    super(
      "Demasiados intentos fallidos. Por favor, espera un momento",
      ErrorCode.TOO_MANY_ATTEMPTS,
      429,
    );
  }
}
