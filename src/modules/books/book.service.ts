import {
  Inject,
  Injectable,
  LOGGER_TOKEN,
  LoggerContract,
  NotFoundException,
} from "@neunoro/fastify-kit";
import { IBookRepository } from "./book.contracts";
import { Book } from "@/domain/entities/Book.entity";
import { CreateBookRequest, UpdateBookRequest } from "./book.dto";

@Injectable()
export class BookService {
  @Inject(IBookRepository)
  private readonly repository!: IBookRepository;

  @Inject(LOGGER_TOKEN)
  private readonly logger!: LoggerContract;

  public async getAllBooks(): Promise<Book[]> {
    this.logger.debug("Obteniendo el catálogo completo de libros");
    return this.repository.findAll();
  }

  public async getBookById(id: string): Promise<Book> {
    const book = await this.repository.findById(id);

    if (!book) {
      this.logger.warn(`Intento de buscar un libro inexistente: ${id}`);
      throw new NotFoundException("Libro", id);
    }

    return book;
  }

  public async createBook(data: CreateBookRequest): Promise<Book> {
    this.logger.info(`Creando nuevo libro: ${data.title}`);
    const newBook = Book.create(data.title, data.author, data.isbn, data.pages);
    await this.repository.save(newBook);
    return newBook;
  }

  public async updateBook(id: string, data: UpdateBookRequest): Promise<Book> {
    const book = await this.getBookById(id);
    book.updateDetails(data);
    await this.repository.save(book);
    this.logger.info(`Libro actualizado exitosamente: ${id}`);
    return book;
  }

  public async markBookAsRead(id: string): Promise<Book> {
    const book = await this.getBookById(id);
    book.markAsRead();
    await this.repository.save(book);
    this.logger.info(`Libro marcado como leído: ${id}`);
    return book;
  }

  public async deleteBook(id: string): Promise<void> {
    // Verificamos que el libro exista antes de intentar eliminarlo,
    // para lanzar una excepción adecuada si no se encuentra.
    await this.getBookById(id);
    await this.repository.delete(id);
    this.logger.info(`Libro eliminado: ${id}`);
  }
}
