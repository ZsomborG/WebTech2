import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Book from '../models/Book';
import { z } from 'zod';

const bookSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear()),
  genre: z.string().min(1, 'Genre is required'),
  quantity: z.number().int().min(0),
});

export const getBooks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = bookSchema.safeParse(req.body);
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || 'Validation failed';
      res.status(400).json({ message: firstError });
      return;
    }

    const { isbn } = validation.data;
    const bookExists = await Book.findOne({ isbn });

    if (bookExists) {
      res.status(400).json({ message: 'A book with this ISBN already exists' });
      return;
    }

    const book = await Book.create({
      ...validation.data,
      addedBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteBook = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    await book.deleteOne();
    res.json({ message: 'Book removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
