import { Module } from "@xneunoro/neucore";
import { BookService } from "./book.service";
import { BookRepository } from "./book.repository";
import { IBookRepository } from "./book.contracts";

@Module({
  // Autodescubrimiento de controladores. La Factory escaneará automáticamente el directorio del módulo y registrará los controladores encontrados. Esto permite una arquitectura modular y escalable sin necesidad de importar manualmente cada controlador en el módulo.
  autoDiscoverControllers: {
    baseDir: import.meta.dirname, // Escanea el directorio actual del módulo
  },
  // Forma tradicional:
  // controllers: [BookController],
  providers: [
    BookService,
    { contract: IBookRepository, implementation: BookRepository },
  ], // La Factory los registrará automáticamente para que el controller consuma
})
export class BookModule {}
