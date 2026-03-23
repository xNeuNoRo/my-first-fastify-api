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
   * @description Marcar el libro como leído. Actualiza el estado de `isRead` a `true` y la fecha de actualización a la fecha actual.
   */
  public markAsRead() {
    this.isRead = true;
    this.updatedAt = new Date();
  }
}
