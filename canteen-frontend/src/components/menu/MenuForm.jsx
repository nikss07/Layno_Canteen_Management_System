import React, { useState, useEffect } from 'react';
import api from '../../services/api';

export default function MenuForm({ item, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', description: '', price: '', category_id: '',
    is_available: true, stock_quantity: '', image: null,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category_id: item.category_id || '',
        is_available: item.is_available ?? true,
        stock_quantity: item.stock_quantity || '',
        image: null,
      });
    }
  }, [item]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || isNaN(form.price) || form.price <= 0) e.price = 'Valid price is required';
    if (!form.category_id) e.category_id = 'Category is required';
    if (!form.stock_quantity || isNaN(form.stock_quantity)) e.stock_quantity = 'Stock quantity is required';
    return e;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (val !== null) formData.append(key, val);
      });
      formData.append('is_available', form.is_available ? 1 : 0);

      if (item) {
        formData.append('_method', 'PUT');
        await api.post(`/menu/${item.id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/menu', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      onSave();
    } catch (err) {
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2.5 rounded-xl border text-sm transition focus:outline-none focus:ring-2 focus:ring-orange-300 ${
      errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200'
    }`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">{item ? 'Edit Menu Item' : 'Add Menu Item'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Image Upload */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-orange-50 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-orange-200">
              {preview || item?.image ? (
                <img src={preview || `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${item.image}`} alt="" className="w-full h-full object-cover" />
              ) : <span className="text-3xl">🍽️</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass('name')} placeholder="e.g. Chicken Adobo" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass('description')} rows={2} placeholder="Brief description..." />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₱) *</label>
              <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass('price')} placeholder="0.00" />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
              <input type="number" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className={inputClass('stock_quantity')} placeholder="0" />
              {errors.stock_quantity && <p className="text-red-500 text-xs mt-1">{errors.stock_quantity}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputClass('category_id')}>
              <option value="">Select category...</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setForm({ ...form, is_available: !form.is_available })}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.is_available ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_available ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm text-gray-700">Available for ordering</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-semibold transition">
              {loading ? 'Saving...' : item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
