import { AppException } from "./AppExceptions";
import { ErrorCode } from "./ErrorCodes";

export class FileTooLargeException extends AppException {
  constructor(maxSize: string) {
    super(
      `El archivo excede el tamaño máximo permitido de ${maxSize}`,
      ErrorCode.FILE_TOO_LARGE,
      413,
    );
  }
}

export class StorageQuotaExceededException extends AppException {
  constructor() {
    super(
      "Has superado tu cuota de almacenamiento disponible",
      ErrorCode.STORAGE_QUOTA_EXCEEDED,
      507,
    );
  }
}
