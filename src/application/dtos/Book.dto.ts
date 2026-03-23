export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
  pages: number;
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  isRead?: boolean;
}
