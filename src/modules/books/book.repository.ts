import { BookRepository } from "@/application/contracts/BookRepository";
import { Book } from "@/domain/entities/Book.entity";
import { CreateBookParams, UpdateBookParams } from "@/domain/types/book.types";
import { PrismaClient } from "@/infrastructure/prisma/client";
import { Inject, Injectable, MapTo } from "@xneunoro/neucore";

@Injectable(BookRepository)
export class PrismaBookRepository implements BookRepository {
  @Inject(PrismaClient)
  private readonly client!: PrismaClient;

  @MapTo(Book)
  async findAll(): Promise<Book[]> {
    return (await this.client.book.findMany()) as unknown as Book[]; // Cast necesario para que el decorador funcione correctamente
  }

  @MapTo(Book)
  async findById(id: Book["id"]): Promise<Book | null> {
    return (await this.client.book.findUnique({
      where: { id },
    })) as unknown as Book | null; // Cast necesario para que el decorador funcione correctamente
  }

  @MapTo(Book)
  async create(data: CreateBookParams): Promise<Book> {
    const newBook = await this.client.book.create({
      data,
    });
    return newBook as unknown as Book; // Cast necesario para que el decorador funcione correctamente
  }

  @MapTo(Book)
  async update(id: Book["id"], data: UpdateBookParams): Promise<Book> {
    const updatedBook = await this.client.book.update({
      where: { id },
      data,
    });
    return updatedBook as unknown as Book; // Cast necesario para que el decorador funcione correctamente
  }

  async delete(id: Book["id"]): Promise<void> {
    await this.client.book.delete({
      where: { id },
    });
  }
}
