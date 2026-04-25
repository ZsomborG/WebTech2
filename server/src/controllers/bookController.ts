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

  getBooks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const books = await this.service.getAllBooks();
      res.json(books);
    } catch (error) {
      next(error);
    }
  };

  addBook = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const validation = bookSchema.safeParse(req.body);
      if (!validation.success) {
        const errors = validation.error.flatten().fieldErrors;
        const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
        return next(new AppError(firstError, 400));
      }

      const book = await this.service.createBook(validation.data, req.user._id);
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  };

  deleteBook = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteBook(req.params.id as string);
      res.json({ message: 'Book removed' });
    } catch (error) {
      next(error);
    }
  };
}

export const bookController = new BookController(bookService);
