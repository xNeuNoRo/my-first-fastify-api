import fp from "fastify-plugin";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import { container, LOGGER_TOKEN, LoggerContract } from "@xneunoro/neucore";
import { NotFoundException } from "@/domain/exceptions/ResourceExceptions";
import { ApiResponse } from "@/domain/common/ApiResponse";
import { AppException } from "@/domain/exceptions/AppExceptions";
import {
  MalformedJsonException,
  ValidationException,
} from "@/domain/exceptions/RequestExceptions";
import { InternalServerException } from "@/domain/exceptions/InfrastructureExceptions";

const errorHandlerPlugin: FastifyPluginAsync = async (app: FastifyInstance) => {
  // Handler para rutas no encontradas (404)
  app.setNotFoundHandler((request, reply) => {
    const logger = container.resolve<LoggerContract>(LOGGER_TOKEN);

    // Registramos un mensaje de advertencia cada vez que se intente acceder a una ruta no definida
    logger.warn(
      `[Route Not Found] Se intentó acceder a: ${request.method} ${request.url}`,
      {
        method: request.method,
        url: request.url,
        ip: request.ip,
      },
    );

    // Creamos una instancia de NotFoundException para representar el error de ruta no encontrada
    const notFoundException = new NotFoundException("Endpoint", request.url);

    // Respondemos con un error 404 utilizando el formato de respuesta de ApiResponse.failure
    return reply
      .status(notFoundException.statusCode)
      .send(ApiResponse.failure(notFoundException.toApiError()));
  });

  app.setErrorHandler((error: any, request, reply) => {
    const logger = container.resolve<LoggerContract>(LOGGER_TOKEN);
    let appException: AppException;

    // Si el error es una instancia de AppException
    if (error instanceof AppException) {
      appException = error;
      if (appException.statusCode >= 400 && appException.statusCode < 500) {
        logger.warn(
          `[Domain Error] ${appException.code} - ${appException.message}`,
          {
            code: appException.code,
            message: appException.message,
            statusCode: appException.statusCode,
          },
        );
      }
    }
    // Si el error tiene un campo "validation" (indica errores de validación en Fastify)
    else if (error.validation) {
      logger.warn(`[Validation Error] Falla en ${error.validationContext}`, {
        validationContext: error.validationContext,
        validationErrors: error.validation,
      });
      appException = new ValidationException(error.validation);
    }
    // Si el error es un error de JSON malformado
    // Tipicamente con ese codigo en Fastify se indica que el body de la petición no es un JSON válido
    else if (
      error.code === "FST_ERR_CTP_INVALID_MEDIA_TYPE" ||
      error.statusCode === 400
    ) {
      logger.warn(`[Bad Request] Petición malformada: ${error.message}`);
      appException = new MalformedJsonException();
    } else {
      logger.error(`[Fatal Error] ${error.message}`, {
        stack: error.stack,
        method: request.method,
        url: request.url,
      });
      appException = new InternalServerException();
    }

    return reply
      .status(appException.statusCode)
      .send(ApiResponse.failure(appException.toApiError()));
  });
};

// Exportamos el plugin utilizando fastify-plugin para que pueda ser registrado en la app Fastify.
export const errorHandler = fp(errorHandlerPlugin, {
  name: "error-handler-plugin",
});
