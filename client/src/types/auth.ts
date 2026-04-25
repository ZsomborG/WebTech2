export interface User {
  _id: string;
  username: string;
  role: 'admin' | 'user';
  token: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}
