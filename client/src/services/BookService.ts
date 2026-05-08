import { BaseService } from './BaseService';
import { type Book, CreateBookDTO, UpdateBookDTO } from '../types/book';

export class BookService extends BaseService {
  async getBooks(): Promise<Book[]> {
    try {
      const response = await this.api.get<Book[]>('/books');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addBook(bookData: CreateBookDTO): Promise<Book> {
    try {
      const response = await this.api.post<Book>('/books', bookData);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateBook(id: string, bookData: UpdateBookDTO): Promise<Book> {
    try {
      const response = await this.api.put<Book>(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deleteBook(id: string): Promise<void> {
    try {
      await this.api.delete(`/books/${id}`);
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const bookService = new BookService();
