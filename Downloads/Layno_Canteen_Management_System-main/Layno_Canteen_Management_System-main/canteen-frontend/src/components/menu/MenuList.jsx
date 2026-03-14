import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import MenuItemCard from './MenuItemCard';
import MenuForm from './MenuForm';
import LoadingSpinner from '../common/LoadingSpinner';

export default function MenuList() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [toast, setToast] = useState('');

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([api.get('/menu'), api.get('/categories')]);
      setItems(menuRes.data.data || menuRes.data);
      setCategories(catRes.data.data || catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await api.delete(`/menu/${id}`);
    fetchData();
    showToast('Item deleted.');
  };

  const handleAddToCart = (item) => {
    addItem(item);
    showToast(`${item.name} added to cart!`);
  };

  const filtered = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || item.category_id === activeCategory;
    return matchSearch && matchCat;
  });

  const isAdmin = user?.role === 'admin';
  const isCashier = user?.role === 'cashier';

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-gray-800 text-white text-sm px-4 py-3 rounded-2xl shadow-xl animate-bounce">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Menu</h1>
          <p className="text-gray-500 text-sm">{filtered.length} items available</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setEditItem(null); setShowForm(true); }}
            className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            + Add Item
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search menu items..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
        />
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeCategory === 'all' ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🍽️</div>
          <p className="font-medium">No items found</p>
          <p className="text-sm">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              showActions={isAdmin}
              onEdit={(i) => { setEditItem(i); setShowForm(true); }}
              onDelete={handleDelete}
              onAddToCart={isCashier || user?.role === 'customer' ? handleAddToCart : null}
            />
          ))}
        </div>
      )}

      {showForm && (
        <MenuForm
          item={editItem}
          categories={categories}
          onSave={() => { setShowForm(false); fetchData(); showToast('Menu item saved!'); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
