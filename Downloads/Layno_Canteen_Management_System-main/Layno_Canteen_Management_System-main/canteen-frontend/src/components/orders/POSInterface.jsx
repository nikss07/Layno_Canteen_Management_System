// ============================================================
// FILE: src/components/orders/POSInterface.jsx
// PURPOSE: Cashier POS — browse items, build cart, place order
// ============================================================

import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import OrderReceipt from './OrderReceipt';
import LoadingSpinner from '../common/LoadingSpinner';

export default function POSInterface() {
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt]   = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const { items: cart, addItem, removeItem, updateQuantity, clearCart, total } = useCart();

  useEffect(() => {
    api.get('/menu-items')
      .then((r) => setItems((r.data.data || r.data).filter((i) => i.is_available)))
      .finally(() => setLoading(false));
  }, []);

  const handleOrder = async () => {
    if (!cart.length) return;
    setSubmitting(true);
    try {
      const res = await api.post('/orders', {
        items: cart.map((i) => ({ menu_item_id: i.id, quantity: i.quantity, price: i.price })),
        total_amount: total,
        payment_method: paymentMethod,
      });
      setReceipt(res.data.data || res.data);
      clearCart();
    } catch (e) { alert(e.response?.data?.message || 'Order failed. Try again.'); }
    finally { setSubmitting(false); }
  };

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-[calc(100vh-1rem)] overflow-hidden mesh-bg m-2 rounded-3xl border border-white/5 shadow-2xl">

      {/* LEFT — Item Grid */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 bg-white/5 border-b border-white/5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">🖥️ POS Terminal</h1>
              <p className="text-xs font-medium text-white/40">Select products to build an order</p>
            </div>
            <div className="relative w-64 group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-orange-400 transition-colors">🔍</span>
              <input 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                placeholder="Find menu items..."
                className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white/10 transition-all" 
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Connecting to inventory..." />
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((item, i) => (
                <button 
                  key={item.id} 
                  onClick={() => addItem(item)}
                  className="relative group p-4 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all duration-300 transform active:scale-95 animate-fadeInUp"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-black/20 border border-white/5">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center text-4xl bg-orange-500/5 text-orange-500/20">🍽️</div>
                    }
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-sm leading-tight truncate">{item.name}</h4>
                    <p className="text-lg font-black text-orange-400 mt-1">₱{parseFloat(item.price).toFixed(2)}</p>
                  </div>
                  <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-50 group-hover:scale-100 shadow-lg">
                    <span className="text-sm font-black">+</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — Cart Sidebar */}
      <div className="w-96 bg-black/40 border-l border-white/5 backdrop-blur-3xl flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-xl">🛒</div>
              <h2 className="text-xl font-black text-white tracking-tight">Checkout</h2>
            </div>
            {cart.length > 0 && (
              <span className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-white/60 tracking-widest uppercase">
                {cart.length} Items
              </span>
            )}
          </div>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-10">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-4xl mb-4 opacity-20">🛒</div>
              <p className="text-white/40 font-bold text-sm">Your checkout is empty</p>
              <p className="text-white/20 text-xs mt-1">Add items from the terminal to begin</p>
            </div>
          ) : cart.map((item, idx) => (
            <div key={item.id} className="group flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all animate-fadeInRight"
              style={{ animationDelay: `${idx * 40}ms` }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-black text-orange-400">₱{(item.price * item.quantity).toFixed(2)}</span>
                  <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider">₱{parseFloat(item.price).toFixed(2)} / ea</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 p-1 bg-black/20 rounded-lg">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-white/60 flex items-center justify-center transition-colors">−</button>
                <span className="w-6 text-center text-[10px] font-black text-white">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 text-white/60 flex items-center justify-center transition-colors">+</button>
              </div>
              <button onClick={() => removeItem(item.id)}
                className="p-2 text-white/10 hover:text-red-400 transition-colors">✕</button>
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        <div className="p-6 bg-white/[0.02] border-t border-white/5 space-y-6">
          
          {/* Payment Option */}
          {cart.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Payment Method</span>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setPaymentMethod('cash')}
                  className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 border flex items-center justify-center ${paymentMethod === 'cash' 
                    ? 'bg-orange-500 text-white border-orange-400 shadow-[0_4px_15px_rgba(249,115,22,0.4)]' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
                  💵 Cash
                </button>
                <button onClick={() => setPaymentMethod('gcash')}
                  className={`py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all gap-2 border flex items-center justify-center ${paymentMethod === 'gcash' 
                    ? 'bg-blue-600 text-white border-blue-500 shadow-[0_4px_15px_rgba(37,99,235,0.4)]' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
                  📱 GCash
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-white/40 font-bold text-[10px] block uppercase tracking-widest">Total Payable</span>
              <span className="text-3xl font-black text-white tracking-tighter">₱{total.toFixed(2)}</span>
            </div>
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-[10px] font-black text-white/20 hover:text-red-400 transition-colors uppercase tracking-widest">
                Cancel All
              </button>
            )}
          </div>

          <button onClick={handleOrder} disabled={!cart.length || submitting}
            className="group w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black rounded-2xl shadow-2xl transition-all duration-300 transform active:scale-95 disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]">
            {submitting ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Finalizing...</>
            ) : (
              <>Complete Order <span className="text-lg group-hover:translate-x-1 transition-transform">→</span></>
            )}
          </button>
        </div>
      </div>

      {receipt && <OrderReceipt order={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}