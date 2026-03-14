import React, { useState, useEffect, useCallback } from 'react';
import orderService from '../../services/orderService';
import LoadingSpinner from '../common/LoadingSpinner';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', next: 'preparing', nextLabel: '▶ Start Preparing' },
  preparing:  { label: 'Preparing',  color: 'bg-blue-100 text-blue-700 border-blue-200',       next: 'ready',     nextLabel: '✅ Mark Ready' },
  ready:      { label: 'Ready',      color: 'bg-green-100 text-green-700 border-green-200',    next: 'completed', nextLabel: '🏁 Complete Order' },
  completed:  { label: 'Completed',  color: 'bg-gray-100 text-gray-600 border-gray-200',       next: null,        nextLabel: null },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-600 border-red-200',          next: null,        nextLabel: null },
};

export default function OrderQueue() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await orderService.getAll();
      setOrders(res.data.data || res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusUpdate = async (id, status) => {
    setUpdating(id);
    try {
      await orderService.updateStatus(id, status);
      fetchOrders();
    } catch (err) { alert('Failed to update status.'); }
    finally { setUpdating(null); }
  };

  const filtered = orders.filter((o) => {
    if (filter === 'active') return ['pending', 'preparing', 'ready'].includes(o.status);
    if (filter === 'completed') return o.status === 'completed';
    if (filter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Queue</h1>
          <p className="text-gray-500 text-sm">Auto-refreshes every 30 seconds</p>
        </div>
        <button onClick={fetchOrders} className="text-sm px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition">
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'active', label: 'Active' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' },
          { key: 'all', label: 'All' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === key ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📋</div>
          <p className="font-medium">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((order) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            return (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-800">#{order.order_number || order.id}</p>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${config.color}`}>{config.label}</span>
                </div>

                <div className="p-4 space-y-2">
                  {order.order_items?.slice(0, 3).map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.menu_item?.name || `Item ${item.menu_item_id}`}</span>
                      <span className="text-gray-500">x{item.quantity}</span>
                    </div>
                  ))}
                  {order.order_items?.length > 3 && (
                    <p className="text-xs text-gray-400">+{order.order_items.length - 3} more items</p>
                  )}
                </div>

                <div className="px-4 pb-4 flex items-center justify-between">
                  <span className="font-bold text-orange-500">₱{parseFloat(order.total_amount).toFixed(2)}</span>
                  <div className="flex gap-2">
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                        className="text-xs px-2 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                      >
                        Cancel
                      </button>
                    )}
                    {config.next && (
                      <button
                        onClick={() => handleStatusUpdate(order.id, config.next)}
                        disabled={updating === order.id}
                        className="text-xs px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium transition"
                      >
                        {updating === order.id ? '...' : config.nextLabel}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
