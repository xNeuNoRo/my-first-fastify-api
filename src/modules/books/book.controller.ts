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
  FastifyReply,
  Version,
  createApiResponseSchema,
} from "@xneunoro/neucore";
import { Type } from "@sinclair/typebox";

@Injectable()
@Version("1") // Versión de API a nivel de controlador. Todas las rutas de este controlador estarán bajo v1/books/...
@Controller("/books")
export class BookController {
  @Inject(BookService)
  private readonly service!: BookService;

  @Get("/", { response: { 200: BookListResponseDto } })
  async getAllV1() {
    return await this.service.getAllBooks();
  }

  @Version("2") // Versión de API a nivel de método. Solo esta ruta estará bajo v2/books/...
  @Get("/", { response: { 200: createApiResponseSchema(Type.String()) } })
  async getAllV2() {
    return "Esta es la versión 2 de la ruta GET /books, sin necesidad de crear un nuevo controlador.";
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
