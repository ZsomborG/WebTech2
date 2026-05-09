import { bookRepository, BookRepository } from '../repositories/BookRepository';
import { borrowRepository, BorrowRepository } from '../repositories/BorrowRepository';
import { AppError } from '../utils/AppError';
import { CreateBookDTO, UpdateBookDTO } from '../types/book';

export class BookService {
  constructor(
    private bookRepo: BookRepository,
    private borrowRepo: BorrowRepository
  ) {}

  async getAllBooks() {
    const books = await this.bookRepo.findAll();
    const activeBorrows = await this.borrowRepo.findAllActive();

    // Attach active borrow count and user's borrow status to each book
    return books.map(book => {
      const bookBorrows = activeBorrows.filter(b => b.book._id.toString() === book._id.toString());
      return {
        ...book.toObject(),
        availableQuantity: book.quantity - bookBorrows.length,
        activeBorrows: bookBorrows
      };
    });
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

    const activeBorrows = await this.borrowRepo.findActiveByBook(id);
    if (activeBorrows.length > 0) {
      throw new AppError('Cannot delete book with active borrows', 400);
    }

    return await this.bookRepo.delete(id);
  }
}

export const bookService = new BookService(bookRepository, borrowRepository);
