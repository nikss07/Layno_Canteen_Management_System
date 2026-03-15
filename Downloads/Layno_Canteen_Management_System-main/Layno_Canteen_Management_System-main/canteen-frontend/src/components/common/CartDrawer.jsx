
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const BASE_URL = 'http://localhost:8000';

export default function CartDrawer({ isOpen, onClose }) {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handleCheckout = async () => {
    if (!items.length) return;
    setSubmitting(true);
    try {
      await api.post('/orders', {
        items: items.map((i) => ({ menu_item_id: i.id, quantity: i.quantity, price: i.price })),
        total_amount: total,
        payment_method: paymentMethod,
      });
      setSuccess(true);
      setTimeout(() => {
        clearCart();
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (e) {
      alert(e.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen && !success) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      
      <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose} />

      
      <div className={`relative w-full max-w-md h-full shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: '#111318', borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
        
        <div className="flex flex-col h-full mesh-bg">
          
          <div className="p-6 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛒</span>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Your Cart</h2>
                <p className="text-xs font-medium text-white/40">{items.length} items added</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 text-white/40 hover:text-white transition-all">
              ✕
            </button>
          </div>

          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fadeIn">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center text-4xl mb-4 border border-emerald-500/30">
                  ✅
                </div>
                <h3 className="text-xl font-black text-white">Order Received!</h3>
                <p className="text-sm text-white/50 mt-2 px-10">Your meal is now being prepared. Please wait for your name to be called.</p>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <div className="text-6xl mb-4">🥡</div>
                <p className="text-lg font-bold text-white">Your cart is empty</p>
                <p className="text-sm mt-1">Browse the menu and add something delicious!</p>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={item.id} className="group relative flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 animate-fadeInRight"
                  style={{ animationDelay: `${idx * 50}ms` }}>
                  {item.image ? (
                    <img src={`${BASE_URL}${item.image}`} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center text-2xl border border-orange-500/20">🍽️</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-orange-400 font-bold mt-0.5">₱{parseFloat(item.price).toFixed(2)}</p>
                    
                    <div className="flex items-center gap-1 mt-2.5">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors">
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-black text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 transition-colors">
                        +
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="absolute top-4 right-4 text-white/20 hover:text-red-400 transition-colors">
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          
          {!success && items.length > 0 && (
            <div className="p-6 border-t border-white/5 space-y-6" style={{ background: 'rgba(255,255,255,0.01)' }}>
              
              
              <div className="space-y-3">
                <span className="text-[10px] font-black tracking-widest text-white/30 uppercase">Select Payment Method</span>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setPaymentMethod('cash')}
                    className={`py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${paymentMethod === 'cash' 
                      ? 'bg-orange-500/20 border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
                    💵 Cash
                  </button>
                  <button onClick={() => setPaymentMethod('gcash')}
                    className={`py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${paymentMethod === 'gcash' 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                      : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}>
                    📱 GCash
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/40 font-bold text-sm tracking-widest uppercase">Total Amount</span>
                <span className="text-3xl font-black text-white">₱{total.toFixed(2)}</span>
              </div>
              
              <button disabled={submitting} onClick={handleCheckout}
                className="w-full py-4 text-white font-black rounded-2xl shadow-2xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:transform-none flex items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', boxShadow: '0 8px 30px rgba(249,115,22,0.3)' }}>
                {submitting ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Finalizing...</>
                ) : (
                  <>✅ Checkout Now</>
                )}
              </button>
              
              <button onClick={clearCart} className="w-full text-center text-xs font-bold text-white/20 hover:text-red-400 transition-colors">
                Empty cart and start over
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
