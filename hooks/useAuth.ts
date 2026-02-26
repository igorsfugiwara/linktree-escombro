// ============================================================
// CONTROLLER LAYER — hooks/useAuth.ts
// Auth state via React Context so all components share the
// same isAuthenticated value.
// ============================================================

import { useState, useCallback, createContext, useContext } from 'react';
import React from 'react';

const SESSION_KEY = 'escombro_admin_session';

// Mock credentials — replace with env vars or real auth
const VALID_CREDENTIALS = [
  { username: 'lingao', password: 'wadawada' },
  { username: 'jota', password: 'naofode' },
];

interface AuthContextType {
  isAuthenticated: boolean;
  error: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });

  const [error, setError] = useState<string | null>(null);

  const login = useCallback((username: string, password: string): boolean => {
    const match = VALID_CREDENTIALS.some(
      c => username.trim().toLowerCase() === c.username && password === c.password
    );
    if (match) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setError(null);
      return true;
    }
    setError('Usuário ou senha incorretos.');
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return React.createElement(AuthContext.Provider, { value: { isAuthenticated, login, logout, error } }, children);
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
