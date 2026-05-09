import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { bookService, BookService } from '../services/BookService';
import { z } from 'zod';
import { AppError } from '../utils/AppError';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(10, 'ISBN is required'),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()),
  genre: z.string().min(1, 'Genre is required'),
  quantity: z.number().int().min(0),
});

export class BookController {
  constructor(private service: BookService) {}

  getBooks = async (req: AuthRequest, res: Response) => {
    const { 
      page, 
      limit, 
      sortBy, 
      order, 
      search, 
      genre,
      all
    } = req.query;

    const options = {
      page: page ? parseInt(page as string) : undefined,
      limit: limit ? parseInt(limit as string) : undefined,
      sortBy: sortBy as string,
      order: order as 'asc' | 'desc',
      search: search as string,
      genre: genre as string,
      all: all === 'true',
    };

    const result = await this.service.getAllBooks(options);
    res.json(result);
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
