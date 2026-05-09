import axios from 'axios';
import { APP_CONSTANTS, STORAGE_KEYS } from '../constants/app.constants';

const api = axios.create({
  baseURL: APP_CONSTANTS.API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const user = localStorage.getItem(STORAGE_KEYS.USER);
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
