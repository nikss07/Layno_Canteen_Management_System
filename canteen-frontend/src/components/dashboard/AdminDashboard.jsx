import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
  LineChart, Line,
} from 'recharts';
import api from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm font-medium text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, salesRes, catRes, trendRes] = await Promise.all([
        api.get('/reports/summary', { params: dateRange }),
        api.get('/reports/daily-sales', { params: dateRange }),
        api.get('/reports/category-breakdown', { params: dateRange }),
        api.get('/reports/order-trends', { params: dateRange }),
      ]);
      setStats(statsRes.data);
      setSalesData(salesRes.data.data || salesRes.data);
      setCategoryData(catRes.data.data || catRes.data);
      setTrendData(trendRes.data.data || trendRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Sales overview and analytics</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 px-3 py-2 shadow-sm">
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} className="text-sm text-gray-600 focus:outline-none" />
          <span className="text-gray-400">→</span>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} className="text-sm text-gray-600 focus:outline-none" />
          <button onClick={fetchData} className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition">Apply</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="💰" label="Total Revenue" value={`₱${parseFloat(stats?.total_revenue || 0).toLocaleString('en', { minimumFractionDigits: 2 })}`} color="bg-orange-100" />
        <StatCard icon="📋" label="Total Orders" value={stats?.total_orders?.toLocaleString() || '0'} color="bg-blue-100" />
        <StatCard icon="📊" label="Avg Order Value" value={`₱${parseFloat(stats?.avg_order_value || 0).toFixed(2)}`} color="bg-green-100" />
        <StatCard icon="📦" label="Low Stock Items" value={stats?.low_stock_count || '0'} sub="items need restocking" color="bg-yellow-100" />
      </div>

      {/* Bar Chart + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Daily Sales Revenue</h3>
          {salesData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data for this period</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salesData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip formatter={(v) => [`₱${parseFloat(v).toFixed(2)}`, 'Revenue']} />
                <Bar dataKey="revenue" fill="#f97316" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">Sales by Category</h3>
          {categoryData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categoryData} dataKey="revenue" nameKey="category" cx="50%" cy="45%" outerRadius={80} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `₱${parseFloat(v).toFixed(2)}`} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-gray-800 mb-4">Order Volume Trend (Last 30 Days)</h3>
        {trendData.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No data for this period</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={2.5} dot={{ fill: '#f97316', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
