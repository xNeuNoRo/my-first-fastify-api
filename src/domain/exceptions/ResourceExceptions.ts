import { AppException } from "./AppExceptions";
import { ErrorCode } from "./ErrorCodes";

export class NotFoundException extends AppException {
  constructor(resource: string, id: string | number) {
    super(`${resource} con ID ${id} no encontrado`, ErrorCode.NOT_FOUND, 404);
  }
}

export class AlreadyExistsException extends AppException {
  constructor(resource: string, field: string, value: string) {
    super(
      `${resource} con ${field} '${value}' ya existe`,
      ErrorCode.ALREADY_EXISTS,
      409,
    );
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message, ErrorCode.CONFLICT, 409);
  }
}

export class ResourceLockedException extends AppException {
  constructor(resource: string) {
    super(
      `El recurso '${resource}' está bloqueado actualmente`,
      ErrorCode.RESOURCE_LOCKED,
      423,
    );
  }
}

export class PreconditionFailedException extends AppException {
  constructor(message: string = "No se cumplen las precondiciones necesarias") {
    super(message, ErrorCode.PRECONDITION_FAILED, 412);
  }
}
