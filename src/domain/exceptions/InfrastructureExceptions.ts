import { AppException } from "./AppExceptions";
import { ErrorCode } from "./ErrorCodes";

export class InternalServerException extends AppException {
  constructor(message: string = "Ha ocurrido un error interno inesperado") {
    super(message, ErrorCode.INTERNAL_SERVER_ERROR, 500);
  }
}

export class DatabaseException extends AppException {
  constructor(
    message: string = "Ha ocurrido un error al contactar la base de datos",
  ) {
    super(message, ErrorCode.DATABASE_ERROR, 500);
  }
}

export class NotImplementedException extends AppException {
  constructor(feature: string) {
    super(
      `La funcionalidad '${feature}' no ha sido implementada`,
      ErrorCode.NOT_IMPLEMENTED,
      501,
    );
  }
}

export class ServiceUnavailableException extends AppException {
  constructor(
    message: string = "El servicio no está disponible temporalmente",
  ) {
    super(message, ErrorCode.SERVICE_UNAVAILABLE, 503);
  }
}

export class ExternalServiceException extends AppException {
  constructor(serviceName: string, details?: unknown) {
    super(
      `Error en el servicio externo: ${serviceName}`,
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      502,
      details,
    );
  }
}

export class ThirdPartyTimeoutException extends AppException {
  constructor(serviceName: string) {
    super(
      `Tiempo de espera agotado con ${serviceName}`,
      ErrorCode.THIRD_PARTY_TIMEOUT,
      504,
    );
  }
}

export class GatewayTimeoutException extends AppException {
  constructor() {
    super(
      "La pasarela de enlace agotó el tiempo de espera",
      ErrorCode.GATEWAY_TIMEOUT,
      504,
    );
  }
}
