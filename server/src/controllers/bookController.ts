import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { bookService, BookService } from '../services/BookService';
import { z } from 'zod';
import { AppError } from '../utils/AppError';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()),
  genre: z.string().min(1, 'Genre is required'),
  quantity: z.number().int().min(0),
});

export class BookController {
  constructor(private service: BookService) {}

  getBooks = async (req: AuthRequest, res: Response) => {
    const books = await this.service.getAllBooks();
    res.json(books);
  };

  addBook = async (req: AuthRequest, res: Response) => {
    const validation = bookSchema.safeParse(req.body);
    if (!validation.success) {
      const { fieldErrors } = z.flattenError(validation.error);
      const firstError = Object.values(fieldErrors)[0]?.[0] || 'Validation failed';
      throw new AppError(firstError, 400);
    }

    const book = await this.service.createBook(validation.data, req.user._id);
    res.status(201).json(book);
  };

  updateBook = async (req: AuthRequest, res: Response) => {
    const validation = bookSchema.safeParse(req.body);
    if (!validation.success) {
      const { fieldErrors } = z.flattenError(validation.error);
      const firstError = Object.values(fieldErrors)[0]?.[0] || 'Validation failed';
      throw new AppError(firstError, 400);
    }

    const book = await this.service.updateBook(req.params.id as string, validation.data);
    res.json(book);
  };

  deleteBook = async (req: AuthRequest, res: Response) => {
    await this.service.deleteBook(req.params.id as string);
    res.json({ message: 'Book removed' });
  };
}

export const bookController = new BookController(bookService);
