import { AppException } from "./AppExceptions";
import { ErrorCode } from "./ErrorCodes";

export class BusinessRuleException extends AppException {
  constructor(
    message: string,
    code: ErrorCode = ErrorCode.BUSINESS_RULE_VIOLATION,
  ) {
    super(message, code, 422);
  }
}

export class InsufficientFundsException extends BusinessRuleException {
  constructor() {
    super(
      "Saldo insuficiente para realizar esta operación",
      ErrorCode.INSUFFICIENT_FUNDS,
    );
  }
}

export class SubscriptionExpiredException extends BusinessRuleException {
  constructor() {
    super("Tu suscripción ha expirado", ErrorCode.SUBSCRIPTION_EXPIRED);
  }
}

export class InvalidOperationException extends AppException {
  constructor(message: string) {
    super(message, ErrorCode.INVALID_OPERATION, 400);
  }
}

export class SessionLimitReachedException extends AppException {
  constructor() {
    super(
      "Has alcanzado el límite máximo de sesiones activas",
      ErrorCode.SESSION_LIMIT_REACHED,
      403,
    );
  }
}

export class PaymentRequiredException extends AppException {
  constructor() {
    super(
      "Se requiere un pago para completar esta acción",
      ErrorCode.PAYMENT_REQUIRED,
      402,
    );
  }
}

export class FeatureNotAvailableException extends AppException {
  constructor(feature: string) {
    super(
      `La funcionalidad '${feature}' no está disponible en tu plan actual`,
      ErrorCode.FEATURE_NOT_AVAILABLE,
      403,
    );
  }
}

export class UnsupportedMediaTypeException extends AppException {
  constructor(mimeType: string) {
    super(
      `El formato de archivo '${mimeType}' no está permitido`,
      ErrorCode.UNSUPPORTED_MEDIA_TYPE,
      415,
    );
  }
}

export class VirusDetectedException extends AppException {
  constructor() {
    super(
      "El archivo ha sido rechazado porque contiene una amenaza de seguridad",
      ErrorCode.VIRUS_DETECTED,
      422,
    );
  }
}
