import React from 'react';

export default function OrderReceipt({ order, onClose }) {
  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-3">✅</div>
          <h2 className="text-2xl font-bold">Order Placed!</h2>
          <p className="text-green-100 text-sm mt-1">Thank you for your order</p>
        </div>

        {/* Order Info */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 text-sm">Order #</span>
            <span className="font-bold text-gray-800">{order.order_number || order.id}</span>
          </div>

          <div className="border-t border-dashed border-gray-200 py-4 space-y-3">
            {order.order_items?.map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.menu_item?.name || item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                <span className="font-medium text-gray-800">₱{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <span className="font-bold text-gray-800">Total</span>
            <span className="text-2xl font-bold text-orange-500">₱{parseFloat(order.total_amount).toFixed(2)}</span>
          </div>

          <div className="mt-4 p-3 bg-orange-50 rounded-xl text-center">
            <span className="text-sm text-orange-600 font-medium">Status: </span>
            <span className="text-sm font-bold text-orange-700 capitalize">{order.status || 'Pending'}</span>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition"
          >
            New Order
          </button>
        </div>
      </div>
    </div>
  );
}
