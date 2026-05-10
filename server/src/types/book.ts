import { z } from 'zod';
import { createBookSchema, updateBookSchema } from '../schemas/book.schema';

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

export type CreateBookDTO = z.infer<typeof createBookSchema>;
export type UpdateBookDTO = z.infer<typeof updateBookSchema>;
