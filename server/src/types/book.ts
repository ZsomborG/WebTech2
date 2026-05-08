export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  quantity: number;
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateBookDTO = Omit<Book, '_id' | 'addedBy' | 'createdAt' | 'updatedAt'>;
export type UpdateBookDTO = Partial<CreateBookDTO>;
