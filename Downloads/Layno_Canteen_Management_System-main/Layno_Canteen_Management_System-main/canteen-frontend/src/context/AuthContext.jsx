// ============================================================
// FILE: src/context/AuthContext.jsx
// PURPOSE: Global auth state — user, login, logout, loading
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = authService.getUser();
    if (stored && authService.isAuthenticated()) setUser(stored);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { user } = await authService.login(email, password);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};