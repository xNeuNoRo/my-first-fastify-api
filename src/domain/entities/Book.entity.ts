import { Mapper } from "packages/core/src";

export class Book {
  constructor(
    public id: string,
    public title: string,
    public author: string,
    public isbn: string,
    public pages: number,
    public isRead: boolean,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  /**
   * @description Método estático para crear una nueva instancia de Book con los datos proporcionados. Genera un ID único y establece las fechas de creación y actualización al momento actual.
   * @param title El título del libro.
   * @param author El autor del libro.
   * @param isbn El número ISBN del libro.
   * @param pages El número de páginas del libro.
   * @returns Una nueva instancia de Book con los datos proporcionados y los campos generados automáticamente.
   */
  public static create(
    title: string,
    author: string,
    isbn: string,
    pages: number,
  ): Book {
    const now = new Date();

    return new Book(
      crypto.randomUUID(),
      title,
      author,
      isbn,
      pages,
      false,
      now,
      now,
    );
  }

  /**
   * @description Método para actualizar los detalles del libro. Permite actualizar el título, autor, ISBN y número de páginas. También actualiza la fecha de actualización a la fecha actual.
   * @param data Un objeto parcial que puede contener las propiedades a actualizar: title, author, isbn y pages. Solo las propiedades definidas en este objeto serán actualizadas en la instancia del libro.
   */
  public updateDetails(
    data: Partial<Pick<Book, "title" | "author" | "isbn" | "pages">>,
  ): void {
    Mapper.patch(this as Book, data);
    this.updatedAt = new Date();
  }

  /**
   * @description Marcar el libro como leído. Actualiza el estado de `isRead` a `true` y la fecha de actualización a la fecha actual.
   */
  public markAsRead() {
    this.isRead = true;
    this.updatedAt = new Date();
  }
}
