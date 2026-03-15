import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e2330', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 14px', fontSize: 12, fontWeight: 700, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#34d399' }}>{payload[0].value} orders</p>
    </div>
  );
};

export default function OrderTrendChart() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    api.get('/reports/sales?period=weekly')
      .then(res => {
        const data = res.data.map(item => ({
          week: item.period,
          orders: parseInt(item.orders) || 0,
        }));
        setChartData(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="rounded-2xl p-5 animate-scaleIn delay-150"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-black text-white text-sm">Order Trends</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Weekly performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: '#34d399', boxShadow: '0 0 8px rgba(52,211,153,0.5)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>Orders</span>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
            Weekly
          </span>
        </div>
      </div>
      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-white/30 text-sm">No trend data yet</div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="areaGradDark" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fontWeight: 600, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="orders" stroke="#34d399" strokeWidth={2.5}
              fill="url(#areaGradDark)"
              dot={{ fill: '#34d399', strokeWidth: 0, r: 4 }}
              activeDot={{ r: 7, fill: '#34d399', strokeWidth: 3, stroke: 'rgba(52,211,153,0.3)' }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}