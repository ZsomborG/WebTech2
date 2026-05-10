import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { bookService, BookService } from '../services/BookService';

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
    const book = await this.service.createBook(req.body, req.user._id);
    res.status(201).json(book);
  };

  updateBook = async (req: AuthRequest, res: Response) => {
    const book = await this.service.updateBook(req.params.id as string, req.body);
    res.json(book);
  };

  deleteBook = async (req: AuthRequest, res: Response) => {
    await this.service.deleteBook(req.params.id as string);
    res.json({ message: 'Book removed' });
  };
}

export const bookController = new BookController(bookService);
