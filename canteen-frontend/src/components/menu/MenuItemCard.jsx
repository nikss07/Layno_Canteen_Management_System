import React from 'react';

export default function MenuItemCard({ item, onEdit, onDelete, onAddToCart, showActions = false }) {
  const imageUrl = item.image
    ? `${process.env.REACT_APP_API_URL?.replace('/api', '')}/storage/${item.image}`
    : null;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col ${!item.is_available ? 'opacity-60' : ''}`}>
      <div className="relative h-40 bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl">🍽️</span>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        <span className="absolute top-2 left-2 bg-white bg-opacity-90 text-xs font-medium px-2 py-1 rounded-full text-gray-600">
          {item.category?.name}
        </span>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1">{item.name}</h3>
        {item.description && (
          <p className="text-xs text-gray-400 mb-3 flex-1 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-orange-500 font-bold text-base">₱{parseFloat(item.price).toFixed(2)}</span>
          {showActions ? (
            <div className="flex gap-1">
              <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs transition">✏️</button>
              <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs transition">🗑️</button>
            </div>
          ) : (
            <button
              onClick={() => onAddToCart && onAddToCart(item)}
              disabled={!item.is_available}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition"
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
