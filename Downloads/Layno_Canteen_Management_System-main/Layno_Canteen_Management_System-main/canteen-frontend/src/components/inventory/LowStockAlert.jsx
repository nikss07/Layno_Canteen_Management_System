// ============================================================
// FILE: src/components/inventory/LowStockAlert.jsx
// PURPOSE: Warning banner listing low-stock items
// ============================================================

export default function LowStockAlert({ items }) {
  if (!items.length) return null;
  return (
    <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl animate-fadeIn">
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0 animate-bounce">⚠️</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-amber-800 text-sm">Low Stock Warning — {items.length} item(s)</h3>
          <p className="text-amber-500 text-xs mt-0.5 mb-2">Please restock these items soon</p>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span key={item.id}
                className={`text-xs px-2.5 py-1 rounded-full font-bold ${item.stock_quantity <= 5 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.name}: {item.stock_quantity} left
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}