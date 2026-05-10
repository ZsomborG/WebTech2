import { BaseService } from './BaseService';
import { type Book, type CreateBookDTO, type UpdateBookDTO } from '../types/book';
import { type PaginatedResponse, type BookQueryFilters } from '../types/api';

export class BookService extends BaseService {
  async getBooks(filters: BookQueryFilters = {}): Promise<PaginatedResponse<Book>> {
    try {
      const response = await this.api.get<PaginatedResponse<Book>>('/books', { params: filters });
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
