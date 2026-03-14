// ============================================================
// FILE: src/components/auth/ProtectedRoute.jsx
// PURPOSE: Guards routes by auth + role. Redirects if no access.
// ============================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();

  // Wait while checking localStorage
  if (loading) return <LoadingSpinner fullScreen />;

  // Not logged in
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Wrong role — redirect to their home
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === 'admin')   return <Navigate to="/admin/dashboard" replace />;
    if (user?.role === 'cashier') return <Navigate to="/cashier/pos"     replace />;
    return <Navigate to="/menu" replace />;
  }

  // ✅ Authorized — render children
  return <Outlet />;
}