import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const STATUS_CFG = {
  pending:   { label:'Pending',   icon:'⏳', ring:'border-amber-500/30 bg-amber-500/5',  badge:'bg-amber-500/20 text-amber-400', dot:'bg-amber-400' },
  preparing: { label:'Preparing', icon:'👨‍🍳', ring:'border-blue-500/30 bg-blue-500/5',    badge:'bg-blue-500/20 text-blue-400',   dot:'bg-blue-400 animate-pulse' },
  ready:     { label:'Ready',     icon:'✅', ring:'border-emerald-500/30 bg-emerald-500/5', badge:'bg-emerald-500/20 text-emerald-400', dot:'bg-emerald-400' },
  completed: { label:'Completed', icon:'🎉', ring:'border-white/10 bg-white/5',           badge:'bg-white/10 text-white/50',   dot:'bg-white/20' },
  cancelled: { label:'Cancelled', icon:'❌', ring:'border-red-500/30 bg-red-500/5',      badge:'bg-red-500/20 text-red-400',    dot:'bg-red-400' },
};

const NEXT = { pending:'preparing', preparing:'ready', ready:'completed' };
const ALL_STATUSES = ['pending','preparing','ready','completed','cancelled'];

export default function OrderQueue() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('all');
  const { user } = useAuth();
  
  const isStaff = user?.role === 'admin' || user?.role === 'cashier';

  const fetchOrders = useCallback(async () => {
    try {
      const res = await orderService.getOrders();
      setOrders(res.data.data || res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchOrders();
    const iv = setInterval(fetchOrders, 10000);
    return () => clearInterval(iv);
  }, [fetchOrders]);

  const advance = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      fetchOrders();
    } catch (e) { alert('Failed to update status'); }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderService.cancelOrder(id);
      fetchOrders();
    } catch (e) { 
      alert(e.response?.data?.message || 'Failed to cancel order'); 
    }
  };

  const displayed = filter === 'all' ? orders : orders.filter((o) => o.status === filter);

  // Formatter for date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + 
           d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-4 lg:p-6 min-h-screen">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fadeInUp">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {isStaff ? <><span className="gradient-text">Order</span> Queue</> : <><span className="gradient-text">My</span> Orders</>}
          </h1>
          {isStaff && (
            <p className="text-white/40 text-xs mt-1 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live monitoring enabled
            </p>
          )}
        </div>
        <button onClick={fetchOrders}
          className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white hover:bg-white/10 transition-all flex items-center gap-2">
          <span>🔄</span> Refresh Now
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="flex gap-2 mb-8 flex-wrap overflow-x-auto pb-1 no-scrollbar animate-fadeInUp" style={{ animationDelay: '50ms' }}>
        <button onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/5 text-white/40 border border-white/5 hover:border-white/20'}`}>
          All ({orders.length})
        </button>
        {ALL_STATUSES.map((s) => {
          const cfg = STATUS_CFG[s];
          const count = orders.filter((o) => o.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === s ? 'bg-white text-gray-900 shadow-xl' : 'bg-white/5 text-white/40 border border-white/5 hover:border-white/20'}`}>
              {cfg.icon} {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* ── Grid ── */}
      {loading && orders.length === 0 ? <LoadingSpinner text="Tracking orders..." /> : displayed.length === 0 ? (
        <div className="text-center py-32 animate-fadeIn">
          <div className="text-7xl mb-4 opacity-20">📋</div>
          <p className="text-white/30 font-bold text-lg">No orders found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((order, i) => {
            const cfg = STATUS_CFG[order.status] || STATUS_CFG.pending;
            const items = order.order_items || order.items || [];
            
            return (
              <div key={order.id}
                className={`group relative rounded-3xl border overflow-hidden transition-all duration-300 animate-fadeInUp ${cfg.ring}`}
                style={{ animationDelay: `${i * 40}ms`, backdropFilter: 'blur(10px)' }}>

                {/* Status Bar */}
                <div className="absolute top-0 left-6 right-6 h-1 rounded-b-full bg-white/5 overflow-hidden">
                   <div className={`h-full transition-all duration-1000 ${cfg.dot}`} style={{ width: order.status === 'completed' ? '100%' : order.status === 'ready' ? '75%' : order.status === 'preparing' ? '50%' : '25%' }} />
                </div>

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="text-white font-black text-lg">Order #{order.id}</h3>
                      <p className="text-[10px] font-bold text-white/30 mt-0.5 uppercase tracking-wider">{formatDate(order.created_at)}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Items list - Simplified for customers */}
                  <div className="space-y-2 mb-6 min-h-[60px]">
                    {items.slice(0, isStaff ? 5 : 3).map((item, j) => (
                      <div key={j} className="flex justify-between items-center bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-black text-orange-400">×{item.quantity}</span>
                          <span className="text-[11px] font-bold text-white/80 truncate">{item.menu_item?.name || item.name}</span>
                        </div>
                        {isStaff && (
                          <span className="text-[10px] font-bold text-white/30 ml-2 flex-shrink-0">₱{(item.price * item.quantity).toFixed(2)}</span>
                        )}
                      </div>
                    ))}
                    {!isStaff && items.length > 3 && (
                      <p className="text-[10px] font-bold text-white/30 text-center italic tracking-wide">...and {items.length - 3} more items</p>
                    )}
                    {isStaff && items.length > 5 && (
                      <p className="text-[10px] font-bold text-white/30 text-center">+{items.length - 5} more items</p>
                    )}
                  </div>

                  {/* Actions & Price */}
                  <div className="pt-5 border-t border-white/5 flex items-center justify-between flex-wrap gap-y-4 gap-x-2">
                    <div className="flex flex-col min-w-[80px]">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">
                        {order.payment_method === 'gcash' ? '📱 GCash' : '💵 Cash'}
                      </span>
                      <span className="text-xl font-black text-white">₱{parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                    
                    <div className="flex gap-1.5 items-center ml-auto">
                       {isStaff ? (
                         <>
                           {NEXT[order.status] && (
                             <button onClick={() => advance(order.id, NEXT[order.status])}
                               className="group/btn px-3.5 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap">
                               <span>{STATUS_CFG[NEXT[order.status]].label}</span>
                               <span className="group-hover/btn:translate-x-0.5 transition-transform">→</span>
                             </button>
                           )}
                           {order.status === 'pending' && (
                             <button onClick={() => handleCancel(order.id)}
                               className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20 hover:border-red-500/40 transition-all active:scale-90 flex-shrink-0"
                               title="Cancel Order">
                               <span className="text-sm">🗑️</span>
                             </button>
                           )}
                         </>
                       ) : (
                         order.status === 'pending' && (
                           <button onClick={() => handleCancel(order.id)}
                             className="px-4 py-2 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20">
                             Cancel Order
                           </button>
                         )
                       )}
                    </div>
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
