import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import LoadingSpinner from '../common/LoadingSpinner';
import OrderReceipt from './OrderReceipt';

export default function POSInterface() {
  const { cartItems, addItem, removeItem, updateQuantity, clearCart, total } = useCart();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [placing, setPlacing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [menuRes, catRes] = await Promise.all([api.get('/menu'), api.get('/categories')]);
        setItems(menuRes.data.data || menuRes.data);
        setCategories(catRes.data.data || catRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filtered = items.filter((item) => {
    if (!item.is_available) return false;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || item.category_id === activeCategory;
    return matchSearch && matchCat;
  });

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    setPlacing(true);
    try {
      const res = await api.post('/orders', {
        items: cartItems.map((i) => ({ menu_item_id: i.id, quantity: i.quantity, price: i.price })),
        total_amount: total,
      });
      setCompletedOrder(res.data.data || res.data);
      clearCart();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (completedOrder) return <OrderReceipt order={completedOrder} onClose={() => setCompletedOrder(null)} />;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full">
      {/* LEFT: Menu Items */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {[{ id: 'all', name: 'All' }, ...categories].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                activeCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Items grid */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((item) => {
              const inCart = cartItems.find((c) => c.id === item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => addItem(item)}
                  className={`bg-white rounded-2xl p-3 text-left border-2 transition hover:shadow-md active:scale-95 ${
                    inCart ? 'border-orange-400 bg-orange-50' : 'border-transparent hover:border-orange-200'
                  }`}
                >
                  <div className="h-24 bg-gradient-to-br from-orange-100 to-amber-50 rounded-xl flex items-center justify-center mb-2 text-3xl">
                    🍱
                  </div>
                  <p className="text-xs font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-orange-500 font-bold text-sm mt-0.5">₱{parseFloat(item.price).toFixed(2)}</p>
                  {inCart && (
                    <span className="inline-block bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full mt-1">
                      x{inCart.quantity}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT: Cart */}
      <div className="w-full lg:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            🛒 Current Order
            {cartItems.length > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <div className="text-4xl mb-2">🛒</div>
              <p className="text-sm">Cart is empty</p>
              <p className="text-xs">Tap items on the left to add</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                  <p className="text-xs text-orange-500 font-semibold">₱{(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition text-sm font-bold flex items-center justify-center">−</button>
                  <span className="w-7 text-center text-sm font-bold text-gray-800">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-200 hover:text-green-500 transition text-sm font-bold flex items-center justify-center">+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition text-lg">✕</button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-2xl font-bold text-orange-500">₱{total.toFixed(2)}</span>
          </div>
          {cartItems.length > 0 && (
            <button onClick={clearCart} className="w-full py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition">
              Clear Cart
            </button>
          )}
          <button
            onClick={handlePlaceOrder}
            disabled={cartItems.length === 0 || placing}
            className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-bold text-sm transition shadow-md"
          >
            {placing ? 'Placing Order...' : `Place Order · ₱${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
