// ============================================================
// FILE: src/context/CartContext.jsx
// PURPOSE: Global cart state for POS / customer ordering
// ============================================================

import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = useCallback((item) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem     = useCallback((id) => setItems((p) => p.filter((i) => i.id !== id)), []);
  const clearCart      = useCallback(() => setItems([]), []);
  const updateQuantity = useCallback((id, qty) => {
    if (qty <= 0) setItems((p) => p.filter((i) => i.id !== id));
    else setItems((p) => p.map((i) => i.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const total     = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};