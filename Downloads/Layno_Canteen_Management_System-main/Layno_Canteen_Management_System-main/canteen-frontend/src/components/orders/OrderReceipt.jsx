// ============================================================
// FILE: src/components/orders/OrderReceipt.jsx
// PURPOSE: Receipt modal shown after successful order placement
// ============================================================

export default function OrderReceipt({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="relative w-full max-w-sm overflow-hidden animate-scaleIn"
        style={{
          background: 'rgba(23, 27, 34, 0.95)',
          borderRadius: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(249, 115, 22, 0.1)',
        }}>
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-[60px] pointer-events-none" />

        {/* Success header */}
        <div className="relative pt-8 pb-6 text-center">
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-4 animate-bounceIn"
            style={{ 
              background: 'linear-gradient(135deg, #10b981, #059669)',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3), 0 0 0 4px rgba(16, 185, 129, 0.1)'
            }}>
            <span className="text-3xl">✅</span>
            <div className="absolute inset-0 rounded-3xl border-2 border-white/20 animate-glow" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Order Placed!</h2>
          <div className="mt-2 inline-flex items-center px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="text-white/60 text-xs font-bold tracking-widest uppercase">Order #{order.id}</span>
          </div>
        </div>

        {/* Receipt body */}
        <div className="px-6 pb-6">
          <div className="glass-strong rounded-2xl p-5 space-y-4" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
            <div className="flex justify-between items-center text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">
              <span>JKM Canteen Receipt</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {(order.order_items || order.items || []).map((item, i) => (
                <div key={i} className="flex justify-between items-center group">
                  <div className="flex flex-col">
                    <span className="text-white/90 text-sm font-bold truncate max-w-[180px]">
                      {item.menu_item?.name || item.name}
                    </span>
                    <span className="text-white/40 text-[10px] font-bold">Qty: {item.quantity}</span>
                  </div>
                  <span className="text-white text-sm font-black tracking-tighter">
                    ₱{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="flex justify-between items-center pt-1">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Total Amount</span>
              <span className="text-2xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 20px rgba(255,255,255,0.2)' }}>
                ₱{parseFloat(order.total_amount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Payment Method</span>
              <span className="text-sm font-black text-white uppercase tracking-wider">
                {order.payment_method === 'gcash' ? '📱 GCash' : '💵 Cash'}
              </span>
            </div>
          </div>

          <div className="mt-5 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest">Status: {order.status || 'Pending'}</span>
            </div>
            <p className="mt-3 text-white/30 text-[10px] font-medium tracking-wide italic">Thank you for your order! 😊</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 bg-white/5 border-t border-white/10 flex gap-3">
          <button onClick={() => window.print()}
            className="flex-1 py-3.5 bg-white/5 text-white/70 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all border border-white/5">
            🖨️ Print
          </button>
          <button onClick={onClose}
            className="flex-1 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-[0_10px_20px_rgba(249,115,22,0.3)] transition-all transform hover:-translate-y-0.5 active:scale-95">
            Done ✓
          </button>
        </div>
      </div>
    </div>
  );
}