// ============================================================
// FILE: src/components/inventory/InventoryTable.jsx
// PURPOSE: Stock table with restock inline input
// ============================================================

import { useState, useEffect } from 'react';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import LowStockAlert from './LowStockAlert';

const BASE_URL = 'http://localhost:8000';
const stockInfo = (qty) => {
  if (qty <=  5) return { label:'Critical', badge:'bg-red-100 text-red-700',       bar:'bg-red-500',    pct: Math.min((qty/50)*100, 100) };
  if (qty <= 10) return { label:'Low',      badge:'bg-yellow-100 text-yellow-700', bar:'bg-yellow-500', pct: Math.min((qty/50)*100, 100) };
  if (qty <= 30) return { label:'Medium',   badge:'bg-blue-100 text-blue-700',     bar:'bg-blue-500',   pct: Math.min((qty/50)*100, 100) };
  return              { label:'Good',      badge:'bg-green-100 text-green-700',   bar:'bg-green-500',  pct: Math.min((qty/50)*100, 100) };
};

export default function InventoryTable() {
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [restockId, setRestockId] = useState(null);
  const [qty, setQty]             = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/inventory');
      setItems(res.data.data || res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleRestock = async (id) => {
    if (!qty || isNaN(qty) || +qty <= 0) return alert('Enter a valid quantity.');
    try {
      await api.patch(`/inventory/${id}/adjust`, { change: parseInt(qty), reason: 'Restock' });
      setRestockId(null); setQty('');
      fetchItems();
    } catch (e) { alert(e.response?.data?.message || 'Restock failed.'); }
  };

  const lowStock = items.filter((i) => i.stock <= 10);

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fadeInUp">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">📦 Inventory</h1>
          <p className="text-gray-400 text-sm mt-0.5">{items.length} items tracked</p>
        </div>
        <button onClick={fetchItems}
         className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white hover:bg-white/10 transition-all flex items-center gap-2">
          <span>🔄</span> Refresh Now
        </button>
      </div>

      <LowStockAlert items={lowStock} />

      {loading ? <LoadingSpinner text="Loading inventory..." /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Item','Category','Stock','Level','Status','Action'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item, i) => {
                const info = stockInfo(item.stock);
                return (
                  <tr key={item.id}
                    className="hover:bg-orange-50/30 transition-colors animate-fadeInUp"
                    style={{ animationDelay: `${i * 25}ms` }}>

                    {/* Item name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-orange-100">
                          {item.image
                            ? <img src={`${BASE_URL}${item.image}`} alt="" className="w-full h-full object-cover" />
                            : <span className="text-lg">🍽️</span>
                          }
                        </div>
                        <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-sm text-gray-400 font-medium">{typeof item.category === 'object' ? item.category?.name : item.category}</td>

                    {/* Stock / restock input */}
                    <td className="px-5 py-3.5">
                      {restockId === item.id ? (
                        <div className="flex items-center gap-1.5">
                          <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)}
                            placeholder="Qty" className="w-16 px-2 py-1.5 border border-orange-300 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                          <button onClick={() => handleRestock(item.id)}
                            className="px-2 py-1.5 bg-orange-500 text-white text-xs rounded-lg hover:bg-orange-600 transition-colors font-bold">✓</button>
                          <button onClick={() => { setRestockId(null); setQty(''); }}
                            className="px-2 py-1.5 bg-gray-100 text-gray-400 text-xs rounded-lg hover:bg-gray-200 transition-colors font-bold">✕</button>
                        </div>
                      ) : (
                        <span className="font-regular text-gray-600">{item.stock ?? 0}</span>
                      )}
                    </td>

                    {/* Progress bar */}
                    <td className="px-5 py-3.5">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${info.bar} rounded-full transition-all duration-700`}
                          style={{ width: `${info.pct}%` }} />
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-bold px-2.5 py-1.5 rounded-full ${info.badge}`}>
                        {info.label}
                      </span>
                    </td>

                    {/* Restock button */}
                    <td className="px-5 py-3.5">
                      <button onClick={() => { setRestockId(item.id); setQty(''); }}
                        className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-xl hover:bg-orange-100 transition-colors border border-orange-200 whitespace-nowrap">
                        + Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}