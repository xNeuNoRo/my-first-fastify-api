import { Type, TSchema } from "@sinclair/typebox";

/**
 * @description Fabrica de esquemas de respuesta para mantener la consistencia en toda la API.
 * Recibe un esquema de datos específico (por ejemplo, BookSchema) y lo envuelve en la estructura estándar de ApiResponse.
 * @param dataSchema Esquema de datos específico que se incluirá en la propiedad `data` de la respuesta.
 * Puede ser un objeto, un array, o cualquier estructura que represente los datos que quieres devolver.
 * @param description Descripción opcional para el esquema de respuesta,
 * útil para la documentación de Swagger. Describe qué representa esta respuesta en el contexto de la API.
 * @example
 * // Para una respuesta que devuelve un solo libro:
 * const SingleBookResponseSchema = createApiResponseSchema(BookSchema, "Respuesta para un solo libro");
 *
 * // Para una respuesta que devuelve una lista de libros:
 * const BookListResponseSchema = createApiResponseSchema(Type.Array(BookSchema), "Respuesta para una lista de libros");
 * @returns Un nuevo esquema de TypeBox que sigue la estructura de ApiResponse, con `success`, `data` y `error`.
 */
export const createApiResponseSchema = <T extends TSchema>(
  dataSchema: T,
  description?: string,
) => {
  return Type.Object(
    {
      success: Type.Boolean(),
      data: dataSchema,
      error: Type.Optional(Type.Any()),
    },
    { description },
  );
};
