// ============================================================
// FILE: src/components/menu/MenuList.jsx
// PURPOSE: Immersive dark full menu page
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import MenuItemCard from './MenuItemCard';
import MenuForm from './MenuForm';
import LoadingSpinner from '../common/LoadingSpinner';

const CATS = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Beverages', 'Desserts'];

export default function MenuList() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [category, setCategory] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const { user } = useAuth();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/menu-items');
      setItems(res.data.data || res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this menu item?')) return;
    try { await api.delete(`/menu-items/${id}`); fetchItems(); }
    catch (e) { alert('Delete failed.'); }
  };

  const filtered = items.filter((i) => {
    const itemName = i.name || '';
    const itemCat = i.category?.name || i.category || 'Other';
    return itemName.toLowerCase().includes(search.toLowerCase()) &&
           (category === 'All' || itemCat === category);
  });

  return (
    <div className="p-4 lg:p-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fadeInUp">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {user?.role === 'admin'
              ? <><span className="gradient-text">Menu</span> Management</>
              : <>Our <span className="gradient-text">Menu</span></>
            }
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {filtered.length} item{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => { setEditItem(null); setShowForm(true); }}
            className="btn-accent flex items-center gap-2 text-sm"
          >
            ➕ Add Item
          </button>
        )}
      </div>

      {/* ── Search + Filter ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fadeInUp" style={{ animationDelay: '60ms' }}>
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="input-dark pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATS.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150"
              style={category === cat
                ? { background: 'linear-gradient(135deg, #f97316, #fb923c)', color: '#fff', boxShadow: '0 4px 14px rgba(249,115,22,0.35)' }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <LoadingSpinner text="Loading menu..." />
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 animate-fadeIn">
          <div className="text-7xl mb-4">🍽️</div>
          <p className="font-bold text-white/50 text-lg">No items found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <MenuItemCard
              key={item.id}
              item={item}
              delay={i * 40}
              onEdit={(item) => { setEditItem(item); setShowForm(true); }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* ── Form modal ── */}
      {showForm && (
        <MenuForm
          item={editItem}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchItems(); }}
        />
      )}
    </div>
  );
}