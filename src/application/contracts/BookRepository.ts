import { Book } from "@/domain/entities/Book.entity";
import { CreateBookParams, UpdateBookParams } from "@/domain/types/book.types";

export abstract class BookRepository {
  abstract findAll(): Promise<Book[]>;
  abstract findById(id: Book["id"]): Promise<Book | null>;
  abstract create(data: CreateBookParams): Promise<Book>;
  abstract update(id: Book["id"], data: UpdateBookParams): Promise<Book>;
  abstract delete(id: Book["id"]): Promise<void>;
}
