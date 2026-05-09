import { BaseService } from './BaseService';
import { type Borrow } from '../types/book';

export class BorrowService extends BaseService {
  async borrowBook(bookId: string): Promise<Borrow> {
    try {
      const response = await this.api.post<Borrow>(`/borrows/${bookId}/borrow`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async returnBook(bookId: string): Promise<Borrow> {
    try {
      const response = await this.api.post<Borrow>(`/borrows/${bookId}/return`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getMyBorrows(): Promise<Borrow[]> {
    try {
      const response = await this.api.get<Borrow[]>('/borrows/my');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getAllActiveBorrows(): Promise<Borrow[]> {
    try {
      const response = await this.api.get<Borrow[]>('/borrows/active');
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const borrowService = new BorrowService();
