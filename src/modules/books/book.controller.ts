import { FastifyReply } from "fastify";
import { BookService } from "./book.service";
import {
  CreateBookRequest,
  UpdateBookRequest,
  BookListResponseDto,
  BookResponseDto,
} from "./book.dto";
import {
  Inject,
  Injectable,
  Get,
  Controller,
  Param,
  UseParams,
  Post,
  Body,
  Patch,
  Delete,
  Res,
} from "@xneunoro/neucore";

@Injectable()
@Controller("/books")
export class BookController {
  @Inject(BookService)
  private readonly service!: BookService;

  @Get("/", { response: { 200: BookListResponseDto } })
  async getAll() {
    return await this.service.getAllBooks();
  }

  @Get("/:id", { response: { 200: BookResponseDto } })
  @UseParams(Param("id"))
  async getById(id: string) {
    return await this.service.getBookById(id);
  }

  @Post("/", { response: { 201: BookResponseDto } })
  @UseParams(Body())
  async create(data: CreateBookRequest) {
    return await this.service.createBook(data);
  }

  @Patch("/:id", { response: { 200: BookResponseDto } })
  @UseParams(Param("id"), Body())
  async update(id: string, data: UpdateBookRequest) {
    return await this.service.updateBook(id, data);
  }

  @Delete("/:id")
  @UseParams(Param("id"), Res())
  async delete(id: string, res: FastifyReply) {
    await this.service.deleteBook(id);
    return res.status(204).send();
  }
}
