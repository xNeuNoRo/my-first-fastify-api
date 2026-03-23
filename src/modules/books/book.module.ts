import { FastifyInstance } from "fastify";
import { container } from "@xneunoro/neucore";

// Importación de Componentes
import { IBookRepository } from "./book.contracts";
import { BookRepository } from "./book.repository";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";

// Importación de Esquemas (DTOs)
import {
  CreateBookRequestDto,
  UpdateBookRequestDto,
  BookResponseDto,
  BookIdParamDto,
  BookListResponseDto,
} from "./book.dto";
import { Type } from "@fastify/type-provider-typebox";

export async function BookModule(fastify: FastifyInstance) {
  // 1. REGISTRO DE DEPENDENCIAS (DI Container)
  // Vinculamos el contrato con la implementación de Prisma
  container.registerClass(IBookRepository, BookRepository);
  container.registerClass(BookService, BookService);
  container.registerClass(BookController, BookController);

  const controller = container.resolve(BookController);

  // 2. DEFINICIÓN DE RUTAS (Endpoints)

  // Listar todos
  fastify.get("/", {
    schema: {
      response: { 200: BookListResponseDto },
    },
    handler: controller.getAll.bind(controller),
  });

  // Obtener por ID
  fastify.get("/:id", {
    schema: {
      params: BookIdParamDto,
      response: { 200: BookResponseDto },
    },
    handler: controller.getById.bind(controller),
  });

  // Crear nuevo
  fastify.post("/", {
    schema: {
      body: CreateBookRequestDto,
      response: { 201: BookResponseDto },
    },
    handler: controller.create.bind(controller),
  });

  // Actualizar parcial
  fastify.patch("/:id", {
    schema: {
      params: BookIdParamDto,
      body: UpdateBookRequestDto,
      response: { 200: BookResponseDto },
    },
    handler: controller.update.bind(controller),
  });

  // Eliminar
  fastify.delete("/:id", {
    schema: {
      params: BookIdParamDto,
      response: { 204: Type.Null() },
    },
    handler: controller.delete.bind(controller),
  });
}
