import Book from '../models/Book';

export class BookRepository {
  async findAll() {
    return await Book.find({}).sort({ createdAt: -1 });
  }

  async findByIsbn(isbn: string) {
    return await Book.findOne({ isbn });
  }

  async findById(id: string) {
    return await Book.findById(id);
  }

  async create(bookData: any) {
    return await Book.create(bookData);
  }

  async delete(id: string) {
    return await Book.findByIdAndDelete(id);
  }
}

export const bookRepository = new BookRepository();
