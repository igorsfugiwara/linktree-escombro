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
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <AdminLogin />;
};

export default ProtectedRoute;
