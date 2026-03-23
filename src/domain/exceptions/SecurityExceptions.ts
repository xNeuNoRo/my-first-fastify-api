import { AppException } from "./AppExceptions";
import { ErrorCode } from "./ErrorCodes";

export class UnauthorizedException extends AppException {
  constructor(
    message: string = "No estás autorizado para acceder a este recurso",
  ) {
    super(message, ErrorCode.UNAUTHORIZED, 401);
  }
}

export class TokenExpiredException extends AppException {
  constructor() {
    super("Tu sesión ha expirado", ErrorCode.TOKEN_EXPIRED, 401);
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string = "No tienes permisos suficientes") {
    super(message, ErrorCode.FORBIDDEN, 403);
  }
}

export class MfaRequiredException extends AppException {
  constructor() {
    super(
      "Se requiere autenticación de dos factores",
      ErrorCode.MFA_REQUIRED,
      403,
    );
  }
}

export class TokenInvalidException extends AppException {
  constructor() {
    super("El token proporcionado no es válido", ErrorCode.TOKEN_INVALID, 401);
  }
}

export class InsufficientPermissionsException extends AppException {
  constructor() {
    super(
      "No tienes los permisos necesarios para realizar esta acción",
      ErrorCode.INSUFFICIENT_PERMISSIONS,
      403,
    );
  }
}

export class AccountDisabledException extends AppException {
  constructor() {
    super(
      "Tu cuenta ha sido desactivada. Contacta con soporte",
      ErrorCode.ACCOUNT_DISABLED,
      403,
    );
  }
}

export class EmailNotVerifiedException extends AppException {
  constructor() {
    super(
      "Debes verificar tu correo electrónico antes de continuar",
      ErrorCode.EMAIL_NOT_VERIFIED,
      403,
    );
  }
}

export class IpBlockedException extends AppException {
  constructor() {
    super(
      "Tu dirección IP ha sido bloqueada por motivos de seguridad",
      ErrorCode.IP_BLOCKED,
      403,
    );
  }
}
