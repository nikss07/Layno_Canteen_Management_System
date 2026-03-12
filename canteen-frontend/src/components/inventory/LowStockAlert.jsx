import React, { useState } from 'react';

export default function LowStockAlert({ items, threshold }) {
  const [dismissed, setDismissed] = useState(false);

  if (!items || items.length === 0 || dismissed) return null;

  return (
    <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-800 text-sm">Low Stock Alert</p>
            <p className="text-yellow-700 text-xs mt-1">
              {items.length} item{items.length !== 1 ? 's' : ''} need{items.length === 1 ? 's' : ''} attention:
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {items.map((item) => (
                <span key={item.id} className={`text-xs px-2 py-1 rounded-full font-medium ${
                  item.stock_quantity === 0
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.name} ({item.stock_quantity === 0 ? 'OUT' : item.stock_quantity + ' left'})
                </span>
              ))}
            </div>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="text-yellow-500 hover:text-yellow-700 transition text-lg leading-none">✕</button>
      </div>
    </div>
  );
}
