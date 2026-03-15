// ============================================================
// FILE: src/components/menu/MenuForm.jsx
// PURPOSE: Dark immersive Add/Edit menu item modal
// ============================================================

import { useState, useEffect } from 'react';
import api from '../../services/api';


const fieldStyles = {
  background: 'var(--surface-3)',
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'var(--text-primary)',
  borderRadius: '0.75rem',
  padding: '0.65rem 1rem',
  fontSize: '0.875rem',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

export default function MenuForm({ item, onSuccess, onClose }) {
  const isEdit = !!item;
  const [form, setForm]       = useState({ name: '', description: '', price: '', stock: '', category_id: '', is_available: true, image: null });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories for the dropdown
    api.get('/categories').then(res => setCategories(res.data.data || res.data)).catch(console.error);

    if (item) {
      setForm({ name: item.name, description: item.description || '', price: item.price, stock: item.stock || 0, category_id: item.category_id || (item.category?.id) || '', is_available: item.is_available, image: null });
      setPreview(item.image ? `http://localhost:8000${item.image}` : null);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      const f = files[0];
      setForm((p) => ({ ...p, image: f }));
      setPreview(URL.createObjectURL(f));
    } else {
      setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleFocus  = (e) => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.15)'; };
  const handleBlur   = (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => { 
        if (v !== null) {
          if (typeof v === 'boolean') {
            data.append(k, v ? 1 : 0);
          } else {
            data.append(k, v); 
          }
        }
      });
      if (isEdit) {
        data.append('_method', 'PUT');
        await api.post(`/menu-items/${item.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/menu-items', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-fadeIn"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg rounded-3xl overflow-hidden animate-slideUp"
        style={{ background: '#15181f', border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 32px 80px rgba(0,0,0,0.7)' }}>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 className="text-white font-black text-base tracking-tight">
            {isEdit ? '✏️ Edit Item' : '➕ New Menu Item'}
          </h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl transition-colors w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/20">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

          {error && (
            <div className="px-4 py-3 rounded-xl text-sm animate-shake"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Image upload */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(249,115,22,0.08)', border: '2px dashed rgba(249,115,22,0.3)' }}>
              {preview
                ? <img src={preview} alt="" className="w-full h-full object-cover" />
                : <span className="text-3xl">🍽️</span>
              }
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all"
                style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
                📷 Upload Photo
                <input type="file" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
              <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>JPG, PNG · Max 2MB</p>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
              Item Name *
            </label>
            <input
              name="name" value={form.name} onChange={handleChange} required
              placeholder="e.g. Chicken Adobo"
              style={fieldStyles}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
              Description
            </label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              rows={2} placeholder="Short description..."
              style={{ ...fieldStyles, resize: 'none' }}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
                Price (₱) *
              </label>
              <input
                name="price" type="number" step="0.01" min="0" value={form.price}
                onChange={handleChange} required placeholder="0.00"
                style={fieldStyles}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
                Stock *
              </label>
              <input
                name="stock" type="number" min="0" value={form.stock}
                onChange={handleChange} required placeholder="0"
                style={fieldStyles}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text-secondary)' }}>
              Category *
            </label>
            <select
              name="category_id" value={form.category_id} onChange={handleChange}
              style={{ ...fieldStyles, cursor: 'pointer' }}
              onFocus={handleFocus} onBlur={handleBlur}
              required
            >
              <option value="" disabled style={{ background: '#1e2330' }}>Select Category</option>
              {categories.map((c) => <option key={c.id} value={c.id} style={{ background: '#1e2330' }}>{c.name}</option>)}
            </select>
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between px-4 py-3.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <p className="text-sm font-bold text-white">Available for Order</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Customers can see and order this item</p>
            </div>
            <button type="button" onClick={() => setForm((p) => ({ ...p, is_available: !p.is_available }))}
              className="relative w-12 h-6 rounded-full transition-all duration-200"
              style={{
                background: form.is_available ? 'linear-gradient(135deg, #f97316, #fb923c)' : 'rgba(255,255,255,0.1)',
                boxShadow: form.is_available ? '0 0 12px rgba(249,115,22,0.4)' : 'none',
              }}>
              <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200"
                style={{ transform: form.is_available ? 'translateX(24px)' : 'translateX(0)' }} />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 text-white rounded-xl text-sm font-black flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', boxShadow: '0 4px 16px rgba(249,115,22,0.35)', opacity: loading ? 0.6 : 1 }}>
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              ) : isEdit ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}