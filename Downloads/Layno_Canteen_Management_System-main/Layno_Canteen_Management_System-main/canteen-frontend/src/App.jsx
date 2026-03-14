// ============================================================
// FILE: src/App.jsx
// PURPOSE: Root component — all routes, layouts, providers
// ============================================================

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';

import { AuthProvider }    from './context/AuthContext';
import { CartProvider }    from './context/CartContext';
import ErrorBoundary       from './components/common/ErrorBoundary';
import ProtectedRoute      from './components/auth/ProtectedRoute';
import Login               from './components/auth/Login';
import LandingPage         from './components/LandingPage';
import Navbar              from './components/common/Navbar';
import Sidebar             from './components/common/Sidebar';
import AdminDashboard      from './components/dashboard/AdminDashboard';
import MenuList            from './components/menu/MenuList';
import POSInterface        from './components/orders/POSInterface';
import OrderQueue          from './components/orders/OrderQueue';
import InventoryTable      from './components/inventory/InventoryTable';
import CartDrawer          from './components/common/CartDrawer';

// Shared layout — sidebar + navbar wrapper
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen]       = useState(false);
  
  return (
    <div className="flex h-screen overflow-hidden mesh-bg">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar 
          onMenuToggle={() => setSidebarOpen(true)} 
          onCartOpen={() => setCartOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>

              {/* ── Public ── */}
              <Route path="/"      element={<LandingPage />} />
              <Route path="/login" element={<Login />} />

              {/* ── Admin ── */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route element={<AppLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/menu"      element={<MenuList />}       />
                  <Route path="/admin/orders"    element={<OrderQueue />}     />
                  <Route path="/admin/inventory" element={<InventoryTable />} />
                </Route>
              </Route>

              {/* ── Cashier ── */}
              <Route element={<ProtectedRoute allowedRoles={['cashier']} />}>
                <Route element={<AppLayout />}>
                  <Route path="/cashier/pos"    element={<POSInterface />} />
                  <Route path="/cashier/orders" element={<OrderQueue />}   />
                </Route>
              </Route>

              {/* ── Customer ── */}
              <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
                <Route element={<AppLayout />}>
                  <Route path="/menu"      element={<MenuList />}    />
                  <Route path="/my-orders" element={<OrderQueue />}  />
                </Route>
              </Route>

              {/* ── Catch-all ── */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}