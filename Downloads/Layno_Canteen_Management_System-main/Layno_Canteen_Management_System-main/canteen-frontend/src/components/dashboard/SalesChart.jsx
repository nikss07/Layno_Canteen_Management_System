import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e2330', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', fontSize: 12, fontWeight: 700, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#f97316' }}>₱{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function SalesChart() {
  const [chartData, setChartData] = useState([]);
useEffect(() => {
  api.get('/reports/sales?period=daily')
    .then(res => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const grouped = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
      res.data.forEach(item => {
        const date = new Date(item.period);
        const day = days[date.getDay()];
        grouped[day] = (grouped[day] || 0) + (parseFloat(item.revenue) || 0);
      });
      const data = Object.entries(grouped).map(([day, sales]) => ({ day, sales }));
      setChartData(data);
    })
    .catch(() => {});
}, []);
	
  const max = chartData.length ? Math.max(...chartData.map((d) => d.sales)) : 0;

  return (
    <div className="rounded-2xl p-5 animate-scaleIn"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-black text-white text-sm">Daily Sales</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Revenue overview</p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316', border: '1px solid rgba(249,115,22,0.25)' }}>
          This Week
        </span>
      </div>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-white/30 text-sm">No sales data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="barGradDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#fb923c" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 600, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(249,115,22,0.06)' }} />
            <Bar dataKey="sales" radius={[8, 8, 0, 0]}>
              {chartData.map((d, i) => (
                <Cell key={i} fill={d.sales === max ? 'url(#barGradDark)' : 'rgba(249,115,22,0.2)'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}