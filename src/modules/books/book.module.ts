import { container } from "@xneunoro/neucore";
import { IBookRepository } from "./book.contracts";
import { BookRepository } from "./book.repository";
import { BookController } from "./book.controller";

/**
 * @description Módulo de Libros.
 * Se encarga de las vinculaciones de contratos y expone los controladores.
 */
export function BookModule() {
  // Vinculamos el contrato del repositorio de libros con su implementación concreta.
  // El framework se encargará de resolver esta dependencia e inyectarla en los servicios que la requieran.
  container.registerClass(IBookRepository, BookRepository);

  return {
    controllers: [BookController],
  };
}
