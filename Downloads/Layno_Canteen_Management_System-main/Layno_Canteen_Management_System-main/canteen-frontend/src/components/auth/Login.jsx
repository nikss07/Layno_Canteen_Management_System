// ============================================================
// FILE: src/components/auth/Login.jsx
// PURPOSE: Immersive dark login page
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DEMO = [
  { role: 'Admin',    email: 'admin@canteen.com',    icon: '⚡', grad: 'from-violet-500 to-purple-600',  glow: 'rgba(139,92,246,0.4)' },
  { role: 'Cashier',  email: 'cashier@canteen.com',  icon: '🖥️', grad: 'from-sky-500 to-blue-600',     glow: 'rgba(14,165,233,0.4)' },
  { role: 'Customer', email: 'customer@canteen.com', icon: '🍽️', grad: 'from-emerald-500 to-green-600', glow: 'rgba(16,185,129,0.4)' },
];

export default function Login() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const user = await login(email, password);
      if      (user.role === 'admin')    navigate('/admin/dashboard');
      else if (user.role === 'cashier')  navigate('/cashier/pos');
      else                               navigate('/menu');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const pickDemo = (d) => {
    setEmail(d.email);
    setPassword('password');
    setActiveDemo(d.role);
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(rgba(17, 19, 24, 0.4), rgba(17, 19, 24, 0.5)), url("http://localhost:8000/images/login-bg.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>

      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full animate-blob"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full animate-blob animation-delay-2000"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.10) 0%, transparent 70%)' }} />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full animate-blob animation-delay-4000"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)' }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo / Brand */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-5 animate-bounceIn animate-float relative"
            style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)', boxShadow: '0 0 40px rgba(249,115,22,0.5), 0 20px 40px rgba(0,0,0,0.4)' }}>
            <span style={{ fontSize: '2.2rem' }}>🍽️</span>
            {/* Ring */}
            <div className="absolute inset-0 rounded-3xl border-2 border-orange-400/50 animate-glow" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none">
            JKM <span className="gradient-text">Canteen</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-2 text-sm font-medium">
            Sign in to manage your canteen
          </p>
        </div>

        {/* Glass Card */}
        <div className="glass-strong rounded-3xl p-8 shadow-2xl animate-scaleIn"
          style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.6)' }}>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm animate-shake"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div className="animate-fadeInUp delay-100">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-secondary)' }}>
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base opacity-40">📧</span>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="input-dark pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div className="animate-fadeInUp delay-150">
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-secondary)' }}>
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base opacity-40">🔒</span>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-dark pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm opacity-40 hover:opacity-80 transition-opacity">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="animate-fadeInUp delay-200 pt-2">
              <button
                id="login-submit"
                type="submit"
                disabled={loading}
                className="btn-accent w-full flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>Sign in <span>→</span></>
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3 animate-fadeInUp delay-300">
            <div className="flex-1 neon-divider" />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Quick Access
            </span>
            <div className="flex-1 neon-divider" />
          </div>

          {/* Demo accounts */}
          <div className="grid grid-cols-3 gap-3 animate-fadeInUp delay-400">
            {DEMO.map((d) => (
              <button
                key={d.role}
                id={`demo-${d.role.toLowerCase()}`}
                onClick={() => pickDemo(d)}
                style={{
                  boxShadow: activeDemo === d.role ? `0 0 20px ${d.glow}, 0 0 0 1px ${d.glow}` : 'none',
                  transition: 'all 0.2s',
                }}
                className={`
                  relative overflow-hidden flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl text-center
                  border border-white/[0.07] hover:border-white/20
                  ${activeDemo === d.role ? 'scale-105' : 'hover:scale-105 active:scale-95'}
                  transition-all duration-200
                `}
                title={d.email}
              >
                {/* Gradient BG pill on active */}
                <div className={`absolute inset-0 bg-gradient-to-br ${d.grad} opacity-${activeDemo === d.role ? '15' : '0'} hover:opacity-10 transition-opacity`} />
                <span className="text-xl relative">{d.icon}</span>
                <span className="text-xs font-bold text-white/80 relative">{d.role}</span>
              </button>
            ))}
          </div>

          <p className="text-center text-xs mt-3 animate-fadeInUp delay-500" style={{ color: 'var(--text-muted)' }}>
            Click a role then <strong className="text-white/50">Sign in</strong>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6 animate-fadeInUp delay-500" style={{ color: 'var(--text-muted)' }}>
          © 2024 Canteen Management System · Built with ❤️
        </p>
      </div>
    </div>
  );
}