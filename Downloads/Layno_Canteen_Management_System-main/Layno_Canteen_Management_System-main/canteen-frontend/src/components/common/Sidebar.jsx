// ============================================================
// FILE: src/components/common/Sidebar.jsx
// PURPOSE: Immersive dark sidebar navigation
// ============================================================

import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV = {
  admin: [
    { to: '/admin/dashboard', icon: '📊', label: 'Dashboard',       color: 'rgba(249,115,22,0.2)',  glow: '#f97316' },
    { to: '/admin/menu',      icon: '🍔', label: 'Menu Management', color: 'rgba(236,72,153,0.2)',  glow: '#ec4899' },
    { to: '/admin/orders',    icon: '📋', label: 'Orders',          color: 'rgba(59,130,246,0.2)',  glow: '#3b82f6' },
    { to: '/admin/inventory', icon: '📦', label: 'Inventory',       color: 'rgba(16,185,129,0.2)', glow: '#10b981' },
  ],
  cashier: [
    { to: '/cashier/pos',    icon: '🖥️', label: 'POS System',   color: 'rgba(249,115,22,0.2)', glow: '#f97316' },
    { to: '/cashier/orders', icon: '📋', label: 'Order Queue',  color: 'rgba(59,130,246,0.2)', glow: '#3b82f6' },
  ],
  customer: [
    { to: '/menu',      icon: '🍽️', label: 'Menu',      color: 'rgba(249,115,22,0.2)', glow: '#f97316' },
    { to: '/my-orders', icon: '📋', label: 'My Orders', color: 'rgba(59,130,246,0.2)', glow: '#3b82f6' },
  ],
};

const ROLE_ICONS = { admin: '⚡', cashier: '🖥️', customer: '🍽️' };

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const links = NAV[user?.role] || [];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden animate-fadeIn"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 z-30 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}
        style={{
          background: 'linear-gradient(180deg, #15181f 0%, #111318 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── Logo ── */}
        <div className="h-16 flex items-center px-5 gap-3 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative"
            style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', boxShadow: '0 0 18px rgba(249,115,22,0.45)' }}>
            <span style={{ fontSize: '1.1rem' }}>🍽️</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-white text-sm leading-none tracking-tight">JKM Canteen</p>
            <p className="text-xs mt-0.5 capitalize font-medium" style={{ color: 'var(--text-muted)' }}>
              {ROLE_ICONS[user?.role]} {user?.role} Panel
            </p>
          </div>
          <button onClick={onClose}
            className="ml-auto lg:hidden text-white/30 hover:text-white/70 transition-colors p-1 rounded-lg hover:bg-white/10 text-lg">
            ✕
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-2"
            style={{ color: 'var(--text-muted)' }}>
            Navigation
          </p>

          {links.map(({ to, icon, label, color, glow }, i) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 relative overflow-hidden group
                animate-fadeInUp delay-${i * 75}
                ${isActive ? 'text-white' : 'text-white/50 hover:text-white/90'}
              `}
              style={({ isActive }) => isActive ? {
                background: color,
                boxShadow: `0 0 20px ${glow}30, inset 0 0 0 1px ${glow}40`,
              } : {}}
            >
              {({ isActive }) => (
                <>
                  {/* Hover bg */}
                  {!isActive && (
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(255,255,255,0.04)' }} />
                  )}
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                      style={{ background: glow }} />
                  )}
                  <span className="text-base w-5 text-center relative z-10 transition-transform group-hover:scale-110 duration-200">
                    {icon}
                  </span>
                  <span className="relative z-10">{label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full relative z-10"
                      style={{ background: glow, boxShadow: `0 0 6px ${glow}` }} />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── User Card ── */}
        <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3 p-3 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white truncate leading-none">{user?.name}</p>
              <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
              style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
          </div>
        </div>
      </aside>
    </>
  );
}