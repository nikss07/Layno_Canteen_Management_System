// ============================================================
// FILE: src/components/menu/MenuItemCard.jsx
// PURPOSE: Immersive dark food item card — adapts by user role
// ============================================================

import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export default function MenuItemCard({ item, onEdit, onDelete, delay = 0 }) {
  const { addItem } = useCart();
  const { user }    = useAuth();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div
      className="relative rounded-2xl overflow-hidden group transition-all duration-300 animate-fadeInUp cursor-default"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        animationDelay: `${delay}ms`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(249,115,22,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
      }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(251,146,60,0.05))' }}>
        {item.image
          ? <img src={`http://localhost:8000${item.image}`} alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
          : <div className="w-full h-full flex items-center justify-center text-6xl select-none group-hover:scale-110 transition-transform duration-300">🍽️</div>
        }

        {/* Gradient overlay at bottom */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,19,24,0.9) 0%, transparent 50%)' }} />

        {/* Category chip */}
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
          {typeof item.category === 'object' ? (item.category?.name || 'Category') : (item.category || 'Category')}
        </span>

        {/* Out of stock */}
        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(2px)' }}>
            <span className="text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full"
              style={{ background: 'rgba(239,68,68,0.9)', color: '#fff', boxShadow: '0 0 20px rgba(239,68,68,0.4)' }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-black text-white text-sm leading-snug truncate">{item.name}</h3>
        <p className="text-xs mt-1 mb-3 line-clamp-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {item.description || 'Freshly prepared for you'}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-black gradient-text">₱{parseFloat(item.price).toFixed(2)}</span>

          {/* Customer */}
          {user?.role === 'customer' && item.is_available && (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-black rounded-xl transition-all duration-200"
              style={added
                ? { background: 'rgba(52,211,153,0.2)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }
                : { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', boxShadow: '0 4px 12px rgba(249,115,22,0.35)' }
              }
            >
              {added ? '✓ Added' : '+ Add'}
            </button>
          )}

          {/* Cashier */}
          {user?.role === 'cashier' && item.is_available && (
            <button onClick={handleAdd}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-black rounded-xl transition-all duration-200"
              style={{ background: 'rgba(14,165,233,0.15)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.3)' }}>
              + Cart
            </button>
          )}

          {/* Admin */}
          {user?.role === 'admin' && (
            <div className="flex gap-1.5">
              <button onClick={() => onEdit(item)}
                className="p-2 rounded-xl text-xs transition-all duration-150"
                style={{ background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.2)' }}>
                ✏️
              </button>
              <button onClick={() => onDelete(item.id)}
                className="p-2 rounded-xl text-xs transition-all duration-150"
                style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                🗑️
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom glow bar */}
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(249,115,22,0.6), transparent)' }} />
    </div>
  );
}