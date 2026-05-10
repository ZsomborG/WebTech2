import { z } from 'zod';
import { bookFormSchema, updateBookSchema } from '../schemas/book.schema';

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  quantity: number;
  addedBy: string;
  createdAt: string;
  updatedAt: string;
  availableQuantity: number;
  activeBorrows?: Borrow[];
}

export interface Borrow {
  _id: string;
  book: string | Partial<Book>;
  user: string | { _id: string; username: string };
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned';
}

export type CreateBookDTO = z.infer<typeof bookFormSchema>;
export type UpdateBookDTO = z.infer<typeof updateBookSchema>;
