import { BaseService } from './BaseService';
import { type Book } from '../types/book';

export interface BookListResponse {
  books: Book[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BookQueryFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  search?: string;
  genre?: string;
  all?: boolean;
}

export class BookService extends BaseService {
  async getBooks(filters: BookQueryFilters = {}): Promise<BookListResponse> {
    try {
      const response = await this.api.get<BookListResponse>('/books', { params: filters });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addBook(bookData: any): Promise<Book> {
    try {
      const response = await this.api.post<Book>('/books', bookData);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateBook(id: string, bookData: any): Promise<Book> {
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
