import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/menu', icon: '🍱', label: 'Menu' },
  { to: '/orders', icon: '📋', label: 'Orders' },
  { to: '/inventory', icon: '📦', label: 'Inventory' },
];

const cashierLinks = [
  { to: '/pos', icon: '🛒', label: 'POS' },
  { to: '/orders', icon: '📋', label: 'Orders' },
  { to: '/inventory', icon: '📦', label: 'Inventory' },
];

const customerLinks = [
  { to: '/menu', icon: '🍱', label: 'Menu' },
  { to: '/my-orders', icon: '📋', label: 'My Orders' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const links =
    user?.role === 'admin' ? adminLinks :
    user?.role === 'cashier' ? cashierLinks :
    customerLinks;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-xl">🍽️</div>
            <div>
              <p className="font-bold text-white">Layno Canteen</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role} Panel</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {links.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
