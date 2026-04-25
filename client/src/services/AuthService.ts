import { BaseService } from './BaseService';
import { type User } from '../types/auth';

export class AuthService extends BaseService {
  async login(credentials: any): Promise<User> {
    try {
      const response = await this.api.post<User>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async register(userData: any): Promise<User> {
    try {
      const response = await this.api.post<User>('/auth/register', userData);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const authService = new AuthService();
