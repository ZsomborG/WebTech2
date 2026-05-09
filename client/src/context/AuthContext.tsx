import { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from '../types/auth';
import { STORAGE_KEYS } from '../constants/app.constants';
import * as React from "react";

interface AuthContextType extends AuthState {
  login: (userData: User) => void;
  logout: () => void;
  switchRole: () => void;
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

  const switchRole = () => {
    setState(prev => {
      if (!prev.user) return prev;
      const newRole = prev.user.role === 'admin' ? 'user' : 'admin';
      const updatedUser = { ...prev.user, role: newRole as 'admin' | 'user' };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, switchRole }}>
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
