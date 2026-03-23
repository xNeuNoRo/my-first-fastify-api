import { Book } from "@/domain/entities/Book.entity";

/**
 * @description Puerto de entrada para la capa de infraestructura,
 * define los métodos que deben ser implementados por cualquier repositorio de libros.
 */
export abstract class IBookRepository {
  abstract findAll(): Promise<Book[]>;
  abstract findById(id: Book["id"]): Promise<Book | null>;
  abstract save(book: Book): Promise<void>;
  abstract delete(id: Book["id"]): Promise<void>;
}
