// ============================================================
// CONTROLLER LAYER — hooks/useAuth.ts
// Auth state via Firebase Auth (email/password + Google).
// ============================================================

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import React from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User,
  type AuthError,
} from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const googleProvider = new GoogleAuthProvider();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      const code = (err as AuthError).code ?? String(err);
      setError(`Erro: ${code}`);
      return false;
    }
  }, []);

  const loginWithGoogle = useCallback(async (): Promise<boolean> => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      return true;
    } catch (err) {
      const code = (err as AuthError).code ?? String(err);
      setError(`Erro: ${code}`);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    signOut(auth);
  }, []);

  return React.createElement(
    AuthContext.Provider,
    { value: { isAuthenticated: !!user, user, loading, error, login, loginWithGoogle, logout } },
    children,
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
