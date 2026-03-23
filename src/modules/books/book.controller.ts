import { Inject, Injectable } from "@xneunoro/neucore";
import { FastifyReply, FastifyRequest } from "fastify";
import { BookService } from "./book.service";
import { CreateBookRequest, UpdateBookRequest, BookIdDto } from "./book.dto";
import { ApiResponse } from "@/domain/common/ApiResponse";

@Injectable()
export class BookController {
  @Inject(BookService)
  private readonly service!: BookService;

  async getAll(_req: FastifyRequest, reply: FastifyReply) {
    const books = await this.service.getAllBooks();
    return reply.send(ApiResponse.success(books));
  }

  async getById(
    req: FastifyRequest<{ Params: BookIdDto }>,
    reply: FastifyReply,
  ) {
    const book = await this.service.getBookById(req.params.id);
    return reply.send(ApiResponse.success(book));
  }

  async create(
    req: FastifyRequest<{ Body: CreateBookRequest }>,
    reply: FastifyReply,
  ) {
    const book = await this.service.createBook(req.body);
    return reply.status(201).send(ApiResponse.success(book));
  }

  async update(
    req: FastifyRequest<{ Params: BookIdDto; Body: UpdateBookRequest }>,
    reply: FastifyReply,
  ) {
    const book = await this.service.updateBook(req.params.id, req.body);
    return reply.send(ApiResponse.success(book));
  }

  async delete(
    req: FastifyRequest<{ Params: BookIdDto }>,
    reply: FastifyReply,
  ) {
    await this.service.deleteBook(req.params.id);
    return reply.status(204).send();
  }
}
