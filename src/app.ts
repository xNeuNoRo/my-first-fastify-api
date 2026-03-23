import fs from "node:fs";
import fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { requestContext } from "@/infrastructure/plugins/requestContext.plugin";
import { errorHandler } from "@/infrastructure/plugins/errorHandler.plugin";
import { ApiResponse } from "@/domain/common/ApiResponse";
import { TooManyRequestsException } from "./domain/exceptions/RequestExceptions";
import { BookModule } from "./modules/books/book.module";

export async function buildApp() {
  const app = fastify({
    http2: true,
    https: {
      key: fs.readFileSync("./localhost+2-key.pem"),
      cert: fs.readFileSync("./localhost+2.pem"),
    },
    logger: false,
    ajv: {
      customOptions: {
        strict: false, // Desactivamos el modo estricto para permitir esquemas más flexibles
      },
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Registramos los plugins personalizados para manejo de contexto de solicitud y manejo de errores
  await app.register(requestContext);
  await app.register(errorHandler);

  // Registramos el plugin de CORS para permitir solicitudes desde cualquier origen (útil para desarrollo, cambiar en producción)
  await app.register(cors, { origin: true });

  // Registramos el plugin de helmet para mejorar la seguridad de la app configurando
  // una política de seguridad de contenido (CSP) que permita solo recursos de confianza
  await app.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Permitimos los estilos y fuentes que usa Scalar UI para que no se rompa la web
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        // Permitimos ejecución de scripts inline solo para la UI de Scalar
        scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "validator.swagger.io"],
      },
    },
  });

  // Registramos el plugin de rate limit para limitar la cantidad de peticiones por IP y evitar abusos
  await app.register(rateLimit, {
    max: 100, // Máximo 100 peticiones
    timeWindow: "1 minute", // Por minuto, por IP
    // Mantenemos la consistencia de la arquitectura devolviendo ApiResponse
    errorResponseBuilder: (_request, _context) => {
      const tooManyRequestsException = new TooManyRequestsException();
      return ApiResponse.failure(tooManyRequestsException.toApiError());
    },
  });

  // Registramos el plugin de Swagger para generar la documentación de la API
  await app.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "Books API",
        description:
          "API de alto rendimiento construida con Fastify y Vertical Slicing",
        version: "1.0.0",
      },
      components: {
        // securitySchemes: {
        //   bearerAuth: {
        //     type: "http",
        //     scheme: "bearer",
        //     bearerFormat: "JWT",
        //   },
        // },
      },
    },
  });

  // Registramos el plugin de Scalar para generar una documentación interactiva y visualmente atractiva de la API en la ruta /docs
  await app.register(scalar, {
    routePrefix: "/docs",
    configuration: {
      theme: "purple",
      layout: "modern",
      metaData: { title: "Books API Docs" },
    },
  });

  app.get("/health", async () => ApiResponse.success(undefined));
  await app.register(BookModule, { prefix: "/api/v1/books" });

  return app;
}
