import {
  Cache,
  ClearCache,
  Retry,
  MapTo,
  Mapper,
  Injectable,
  Inject,
  Transactional,
} from "@xneunoro/neucore";

import { DatabaseService } from "@/infrastructure/database/DatabaseService";
import { Book } from "@/domain/entities/Book.entity";
import { IBookRepository } from "./book.contracts";

@Injectable()
export class BookRepository implements IBookRepository {
  @Inject(DatabaseService)
  private readonly db!: DatabaseService;

  @Cache("books")
  @MapTo(Book)
  public async findAll(): Promise<Book[]> {
    return Mapper.infer<Promise<Book[]>>(
      this.db.client.book.findMany({
        orderBy: { createdAt: "desc" },
      }),
    );
  }

  @Cache("books")
  @MapTo(Book)
  public async findById(id: Book["id"]): Promise<Book | null> {
    return Mapper.infer<Promise<Book | null>>(
      this.db.client.book.findUnique({
        where: { id },
      }),
    );
  }

  @Retry(3, 500)
  @ClearCache("books")
  @Transactional()
  public async save(book: Book): Promise<void> {
    await this.db.client.book.upsert({
      where: { id: book.id },
      update: {
        title: book.title,
        author: book.author,
        pages: book.pages,
        isRead: book.isRead,
        updatedAt: book.updatedAt,
      },
      create: {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        pages: book.pages,
        isRead: book.isRead,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
    });
  }

  @Retry(3, 500)
  @ClearCache("books")
  @Transactional()
  public async delete(id: string): Promise<void> {
    await this.db.client.book.delete({
      where: { id },
    });
  }
}
