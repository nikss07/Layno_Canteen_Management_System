// ============================================================
// FILE: src/components/dashboard/AdminDashboard.jsx
// PURPOSE: Immersive dark admin dashboard – stat cards + charts
// ============================================================

import { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import SalesChart from './SalesChart';
import CategoryPieChart from './CategoryPieChart';
import OrderTrendChart from './OrderTrendChart';
import LoadingSpinner from '../common/LoadingSpinner';

function StatCard({ icon, label, format, sub, color, bg, border, trend, trendUp, value, delay }) {
  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden cursor-default animate-fadeInUp group transition-all duration-300"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        animationDelay: `${delay}ms`,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 transition-opacity duration-300 group-hover:opacity-40"
        style={{ background: `radial-gradient(circle, ${color}, transparent 70%)` }} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            {icon}
          </div>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trendUp ? 'text-emerald-400' : 'text-red-400'}`}
            style={{ background: trendUp ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }}>
            {trendUp ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        </div>
        <p className="text-2xl font-black text-white mt-1" style={{ textShadow: `0 0 20px ${color}60` }}>
          {format(value)}
        </p>
        <p className="text-sm font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{sub}</p>}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getSalesReport()
      .then((r) => setStats(r.data))
      .catch(() => setStats({
        total_sales: 0, total_orders: 0,
        avg_order_value: 0, today_orders: 0,
        trends: { sales: 0, orders: 0, today_orders: 0 }
      }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const trends = stats?.trends || {};

  const CARDS = [
    {
      icon: '💰', label: 'Total Revenue', key: 'total_sales',
      format: (v) => `₱${(v || 0).toLocaleString()}`,
      sub: 'All Time Revenue',
      color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)',
      trend: trends.sales || 0, trendUp: (trends.sales || 0) >= 0,
    },
    {
      icon: '📋', label: 'Total Orders', key: 'total_orders',
      format: (v) => (v || 0).toLocaleString(),
      sub: 'All Time Orders',
      color: '#38bdf8', bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.25)',
      trend: trends.orders || 0, trendUp: (trends.orders || 0) >= 0,
    },
    {
      icon: '📊', label: 'Avg. Order Value', key: 'avg_order_value',
      format: (v) => `₱${(parseFloat(v) || 0).toFixed(2)}`,
      sub: 'Per transaction',
      color: '#34d399', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)',
      trend: trends.sales || 0, trendUp: (trends.sales || 0) >= 0,
    },
    {
      icon: '🕐', label: "Today's Orders", key: 'today_orders',
      format: (v) => (v || 0).toLocaleString(),
      sub: 'Last 24 hours',
      color: '#a78bfa', bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.25)',
      trend: trends.today_orders || 0, trendUp: (trends.today_orders || 0) >= 0,
    },
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* Page Header */}
      <div className="animate-fadeInUp flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Overview <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Here's what's happening in your canteen today
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400"
          style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live Data
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map((c, i) => (
          <StatCard key={c.label} {...c} value={stats?.[c.key]} delay={i * 80} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeInUp delay-300">
        <SalesChart />
        <CategoryPieChart />
      </div>

      {/* Charts Row 2 */}
      <div className="animate-fadeInUp delay-400">
        <OrderTrendChart />
      </div>
    </div>
  );
}