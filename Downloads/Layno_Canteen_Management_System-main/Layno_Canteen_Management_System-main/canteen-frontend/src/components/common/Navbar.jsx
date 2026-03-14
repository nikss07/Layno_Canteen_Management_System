// ============================================================
// FILE: src/components/common/Navbar.jsx
// PURPOSE: Immersive dark top navigation bar
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const ROLE_CONFIG = {
  admin:    { label: 'Admin',    color: '#a78bfa', bg: 'rgba(139,92,246,0.15)',   badge: 'rgba(139,92,246,0.3)'  },
  cashier:  { label: 'Cashier',  color: '#38bdf8', bg: 'rgba(14,165,233,0.15)',   badge: 'rgba(14,165,233,0.3)'  },
  customer: { label: 'Customer', color: '#34d399', bg: 'rgba(16,185,129,0.15)',  badge: 'rgba(16,185,129,0.3)'  },
};

const PAGE_TITLES = {
  '/admin/dashboard': { title: 'Dashboard',       icon: '📊' },
  '/admin/menu':      { title: 'Menu Management', icon: '🍔' },
  '/admin/orders':    { title: 'Orders',           icon: '📋' },
  '/admin/inventory': { title: 'Inventory',        icon: '📦' },
  '/cashier/pos':     { title: 'POS System',       icon: '🖥️' },
  '/cashier/orders':  { title: 'Order Queue',      icon: '📋' },
  '/menu':            { title: 'Menu',             icon: '🍽️' },
  '/my-orders':       { title: 'My Orders',        icon: '📋' },
};

export default function Navbar({ onMenuToggle, onCartOpen }) {
  const { user, logout }  = useAuth();
  const { itemCount }     = useCart();
  const navigate          = useNavigate();
  const location          = useLocation();
  const [open, setOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const role = ROLE_CONFIG[user?.role] || ROLE_CONFIG.customer;
  const page = PAGE_TITLES[location.pathname] || { title: '', icon: '' };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/login'); };

  return (
    <header
      className="h-16 flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(17,19,24,0.9)'
          : 'rgba(17,19,24,0.6)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      {/* Hamburger — mobile */}
      <button
        id="nav-menu-toggle"
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-xl transition-all duration-150 text-white/50 hover:text-white hover:bg-white/10 text-xl"
      >
        ☰
      </button>

      {/* Page title */}
      <div className="hidden sm:flex items-center gap-2">
        {page.icon && (
          <span className="text-lg">{page.icon}</span>
        )}
        <h1 className="text-base font-bold text-white/90">{page.title}</h1>
      </div>

      <div className="flex-1" />

      {/* Right cluster */}
      <div className="flex items-center gap-2">

        {/* Cart */}
        {(user?.role === 'customer' || user?.role === 'cashier') && (
          <button
            onClick={onCartOpen}
            className="relative p-2.5 rounded-xl transition-all duration-150 hover:bg-white/10 text-white/50 hover:text-white text-xl"
          >
            🛒
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 text-white text-[10px] rounded-full flex items-center justify-center font-black"
                style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', boxShadow: '0 0 10px rgba(249,115,22,0.6)' }}>
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
        )}

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: 'rgba(255,255,255,0.09)' }} />

        {/* User dropdown */}
        <div className="relative">
          <button
            id="nav-user-menu"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all duration-150 hover:bg-white/10 border border-transparent hover:border-white/10"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', boxShadow: '0 0 12px rgba(249,115,22,0.4)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block capitalize"
                style={{ background: role.bg, color: role.color, border: `1px solid ${role.badge}` }}>
                {user?.role}
              </span>
            </div>
            <span className="text-white/30 text-xs">▾</span>
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div
                className="absolute right-0 top-12 w-56 rounded-2xl overflow-hidden z-20 animate-fadeInDown"
                style={{
                  background: '#1a1e27',
                  border: '1px solid rgba(255,255,255,0.09)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Signed in as</p>
                  <p className="text-sm font-bold text-white truncate mt-0.5">{user?.email}</p>
                </div>
                <button
                  id="nav-logout"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm font-semibold flex items-center gap-2 transition-colors hover:bg-red-500/10"
                  style={{ color: '#f87171' }}
                >
                  <span>🚪</span> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}