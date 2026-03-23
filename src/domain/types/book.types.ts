export type CreateBookParams = {
  title: string;
  author: string;
  isbn: string;
  pages: number;
};

export type UpdateBookParams = {
  title?: string;
  author?: string;
  isRead?: boolean;
};
