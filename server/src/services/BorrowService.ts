import { borrowRepository, BorrowRepository } from '../repositories/BorrowRepository';
import { bookRepository, BookRepository } from '../repositories/BookRepository';
import { AppError } from '../utils/AppError';

export class BorrowService {
  constructor(
    private borrowRepo: BorrowRepository,
    private bookRepo: BookRepository
  ) {}

  async borrowBook(bookId: string, userId: string) {
    const book = await this.bookRepo.findById(bookId);
    if (!book) {
      throw new AppError('Book not found', 404);
    }

    const activeBorrows = await this.borrowRepo.findActiveByBook(bookId);
    if (activeBorrows.length >= book.quantity) {
      throw new AppError('No copies available for borrowing', 400);
    }

    const alreadyBorrowed = await this.borrowRepo.findActiveByBookAndUser(bookId, userId);
    if (alreadyBorrowed) {
      throw new AppError('You already have an active borrow for this book', 400);
    }

    // Default due date: 14 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    return await this.borrowRepo.create({
      book: bookId,
      user: userId,
      dueDate
    });
  }

  async returnBook(bookId: string, userId: string, isAdmin = false) {
    const borrow = await this.borrowRepo.findActiveByBookAndUser(bookId, userId);
    
    if (!borrow) {
      throw new AppError('No active borrow found for this book and user', 404);
    }

    return await this.borrowRepo.update(borrow._id.toString(), {
      status: 'returned',
      returnDate: new Date()
    });
  }

  async getMyBorrows(userId: string) {
    return await this.borrowRepo.findByUser(userId);
  }

  async getAllActiveBorrows() {
    return await this.borrowRepo.findAllActive();
  }
}

export const borrowService = new BorrowService(borrowRepository, bookRepository);
