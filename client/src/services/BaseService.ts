import { type AxiosInstance } from 'axios';
import api from '../lib/api';

export class BaseService {
  protected api: AxiosInstance;

  constructor() {
    this.api = api;
  }

  protected handleError(error: any): never {
    const message = error.response?.data?.message || 'An unexpected error occurred';
    throw new Error(message);
  }
}
