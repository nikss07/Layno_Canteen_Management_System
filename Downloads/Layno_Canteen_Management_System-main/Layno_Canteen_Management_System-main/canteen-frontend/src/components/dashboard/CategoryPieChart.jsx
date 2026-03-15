import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const COLORS = ['#f97316', '#a78bfa', '#34d399', '#38bdf8', '#f472b6', '#fbbf24'];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e2330', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', fontSize: 12, fontWeight: 700, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p style={{ color: payload[0].payload.fill || '#fff' }}>{payload[0].name}</p>
      <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>₱{parseFloat(payload[0].value).toLocaleString()}</p>
    </div>
  );
};

export default function CategoryPieChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    api.get('/reports/category-breakdown')
      .then(res => {
        const data = res.data.map(item => ({
          name: item.category,
          value: parseFloat(item.revenue) || 0,
        }));
        setChartData(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-2xl p-5 animate-scaleIn delay-75"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-black text-white text-sm">Sales by Category</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Distribution overview</p>
        </div>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
          % Share
        </span>
      </div>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-white/30 text-sm">No category data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
              dataKey="value" paddingAngle={4} strokeWidth={0}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.9} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" iconSize={7}
              formatter={(v) => <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}