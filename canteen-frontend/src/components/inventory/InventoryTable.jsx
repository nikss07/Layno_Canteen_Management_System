import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import LowStockAlert from './LowStockAlert';

const LOW_THRESHOLD = 10;

export default function InventoryTable() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(null);
  const [adjustForm, setAdjustForm] = useState({ amount: '', reason: '' });
  const [search, setSearch] = useState('');

  const fetchItems = async () => {
    try {
      const res = await api.get('/inventory');
      setItems(res.data.data || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdjust = async () => {
    if (!adjustForm.amount || !adjustForm.reason) { alert('Fill in amount and reason.'); return; }
    try {
      await api.post(`/inventory/${adjusting}/adjust`, {
        change_amount: parseInt(adjustForm.amount),
        reason: adjustForm.reason,
      });
      setAdjusting(null);
      setAdjustForm({ amount: '', reason: '' });
      fetchItems();
    } catch (err) { alert(err.response?.data?.message || 'Failed to adjust stock.'); }
  };

  const lowStock = items.filter((i) => i.stock_quantity <= LOW_THRESHOLD && i.stock_quantity > 0);
  const outOfStock = items.filter((i) => i.stock_quantity === 0);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
          <p className="text-gray-500 text-sm">{items.length} items tracked</p>
        </div>
        <div className="flex gap-2">
          {outOfStock.length > 0 && (
            <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-xl border border-red-200">
              🚫 {outOfStock.length} Out of Stock
            </span>
          )}
          {lowStock.length > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-xl border border-yellow-200">
              ⚠️ {lowStock.length} Low Stock
            </span>
          )}
        </div>
      </div>

      <LowStockAlert items={[...outOfStock, ...lowStock]} threshold={LOW_THRESHOLD} />

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search inventory..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((item) => {
                const isOut = item.stock_quantity === 0;
                const isLow = item.stock_quantity > 0 && item.stock_quantity <= LOW_THRESHOLD;
                return (
                  <tr key={item.id} className={`hover:bg-gray-50 transition ${isOut ? 'bg-red-50' : isLow ? 'bg-yellow-50' : ''}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.category?.name || '—'}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-orange-500">₱{parseFloat(item.price).toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold text-sm ${isOut ? 'text-red-500' : isLow ? 'text-yellow-600' : 'text-gray-800'}`}>
                        {item.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isOut ? (
                        <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">Out of Stock</span>
                      ) : isLow ? (
                        <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-1 rounded-full">Low Stock</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">In Stock</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setAdjusting(item.id)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium transition"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjusting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">Adjust Stock</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (use negative to reduce)</label>
                <input
                  type="number"
                  value={adjustForm.amount}
                  onChange={(e) => setAdjustForm({ ...adjustForm, amount: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="e.g. 20 or -5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input
                  type="text"
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  placeholder="e.g. Restocked from supplier"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setAdjusting(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleAdjust} className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
