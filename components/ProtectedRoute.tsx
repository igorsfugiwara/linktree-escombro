// ============================================================
// CONTROLLER LAYER — components/ProtectedRoute.tsx
// Wraps admin routes. Redirects to login if not authenticated.
// ============================================================

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminLogin from './admin/AdminLogin';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <AdminLogin />;
};

export default ProtectedRoute;
