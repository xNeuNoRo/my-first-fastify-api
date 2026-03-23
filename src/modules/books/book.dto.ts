import { createApiResponseSchema } from "@/infrastructure/http/schemas/ApiResponseSchema";
import { Type, Static } from "@sinclair/typebox";

// Esquema base que representa la entidad de dominio Book
export const BookSchema = Type.Object(
  {
    id: Type.String({ format: "uuid", description: "ID único del libro" }),
    title: Type.String({
      minLength: 1,
      maxLength: 200,
      description: "Título de la obra",
    }),
    author: Type.String({
      minLength: 1,
      maxLength: 100,
      description: "Autor principal",
    }),
    isbn: Type.String({
      description: "Código ISBN (International Standard Book Number)",
    }),
    pages: Type.Number({ minimum: 1, description: "Cantidad de páginas" }),
    isRead: Type.Boolean({ description: "Indica si el libro ya fue leído" }),
    // En las APIs HTTP, las fechas viajan como strings ISO 8601
    createdAt: Type.String({
      format: "date-time",
      description: "Fecha de registro",
    }),
    updatedAt: Type.String({
      format: "date-time",
      description: "Fecha de última modificación",
    }),
  },
  { $id: "Book", description: "Esquema de datos del Libro" },
);

// Extraemos el tipo de inferido para usarlo en otros lugares
export type BookDTO = Static<typeof BookSchema>;

// ==========================
// Dtos de entrada (requests)
// ==========================

// Dto de creación
export const CreateBookRequestDto = Type.Object(
  {
    title: Type.String({ minLength: 1, maxLength: 200 }),
    author: Type.String({ minLength: 1, maxLength: 100 }),
    isbn: Type.String(),
    pages: Type.Number({ minimum: 1 }),
  },
  {
    $id: "CreateBookRequest",
    description: "Payload requerido para registrar un nuevo libro",
  },
);

// Tipo inferido para el request de creación
export type CreateBookRequest = Static<typeof CreateBookRequestDto>;

// Dto de actualización (todos los campos opcionales para permitir actualizaciones parciales)
export const UpdateBookRequestDto = Type.Partial(CreateBookRequestDto, {
  $id: "UpdateBookRequest",
  description: "Payload para actualizar la información básica de un libro",
});

export type UpdateBookRequest = Static<typeof UpdateBookRequestDto>;

// ==========================
// Dtos de salida (responses)
// ==========================

// Response estándar para un solo Book
export const BookResponseDto = createApiResponseSchema(
  BookSchema,
  "Respuesta estándar exitosa con los datos de un libro",
);

// Response estándar para una lista de Books
export const BookListResponseDto = createApiResponseSchema(
  Type.Array(BookSchema),
  "Respuesta estándar exitosa con una lista de libros",
);
