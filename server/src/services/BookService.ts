import { bookRepository, BookRepository } from '../repositories/BookRepository';
import { AppError } from '../utils/AppError';
import { CreateBookDTO, UpdateBookDTO } from '../types/book';

export class BookService {
  constructor(private bookRepo: BookRepository) {}

  async getAllBooks() {
    return await this.bookRepo.findAll();
  }

  async createBook(bookData: CreateBookDTO, userId: string) {
    const bookExists = await this.bookRepo.findByIsbn(bookData.isbn);
    if (bookExists) {
      throw new AppError('A book with this ISBN already exists', 400);
    }

    return await this.bookRepo.create({
      ...bookData,
      addedBy: userId,
    });
  }

  async updateBook(id: string, bookData: UpdateBookDTO) {
    const book = await this.bookRepo.findById(id);
    if (!book) {
      throw new AppError('Book not found', 404);
    }
    return await this.bookRepo.update(id, bookData);
  }

  async deleteBook(id: string) {
    const book = await this.bookRepo.findById(id);
    if (!book) {
      throw new AppError('Book not found', 404);
    }
    return await this.bookRepo.delete(id);
  }
}

export const bookService = new BookService(bookRepository);
