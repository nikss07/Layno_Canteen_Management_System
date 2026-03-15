// ============================================================
// FILE: src/services/authService.js
// PURPOSE: Login, logout, token & user storage helpers
// ============================================================
import api from './api';
export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    return { token, user };
  },
  logout: async () => {
    try { await api.post('/auth/logout'); } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    }
  },
  getUser:          () => { const u = localStorage.getItem('auth_user'); return u ? JSON.parse(u) : null; },
  getToken:         () => localStorage.getItem('auth_token'),
  isAuthenticated:  () => !!localStorage.getItem('auth_token'),
};