// ============================================================
// FILE: src/components/dashboard/SalesChart.jsx
// PURPOSE: Dark-themed bar chart — daily sales using Recharts
// ============================================================

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const MOCK = [
  { day: 'Mon', sales: 2400 }, { day: 'Tue', sales: 3200 }, { day: 'Wed', sales: 2800 },
  { day: 'Thu', sales: 4100 }, { day: 'Fri', sales: 5200 }, { day: 'Sat', sales: 6800 }, { day: 'Sun', sales: 4300 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e2330', border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 12, padding: '10px 14px', fontSize: 12, fontWeight: 700,
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#f97316' }}>₱{payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function SalesChart({ data = [] }) {
  const chartData = data.length ? data : MOCK;
  const max = Math.max(...chartData.map((d) => d.sales));

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
    </div>
  );
}