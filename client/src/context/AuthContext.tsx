import { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from '../types/auth';
import { STORAGE_KEYS } from '../constants/app.constants';
import * as React from "react";

interface AuthContextType extends AuthState {
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      setState({ user: JSON.parse(storedUser), loading: false });
    } else {
      setState({ user: null, loading: false });
    }
  }, []);

  const login = (userData: User) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    setState({ user: userData, loading: false });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    setState({ user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
