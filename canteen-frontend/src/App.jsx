import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import AdminDashboard from './components/dashboard/AdminDashboard';
import MenuList from './components/menu/MenuList';
import POSInterface from './components/orders/POSInterface';
import InventoryTable from './components/inventory/InventoryTable';
import OrderQueue from './components/orders/OrderQueue';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/menu" element={<ProtectedRoute><MenuList /></ProtectedRoute>} />
          <Route path="/pos" element={<ProtectedRoute><POSInterface /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><InventoryTable /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderQueue /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;