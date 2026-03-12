import React, { useState } from 'react';

const App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fillDemo = (e, u, p) => {
    e.preventDefault();
    setEmail(u);
    setPassword(p);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🍽️</div>
          <h1 className="text-3xl font-bold text-gray-800">Layno Canteen</h1>
          <p className="text-gray-500">Management System</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">Sign in to your account</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-200 shadow-lg">
            Sign In
          </button>
        </form>

        {/* Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quick Demo Access</p>
          <div className="space-y-2">
            <button 
              onClick={(e) => fillDemo(e, 'admin@canteen.com', 'password')}
              className="w-full text-left p-3 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm transition"
            >
              👑 <span className="font-semibold">Admin:</span> admin@canteen.com
            </button>
            <button 
              onClick={(e) => fillDemo(e, 'cashier@canteen.com', 'password')}
              className="w-full text-left p-3 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm transition"
            >
              💰 <span className="font-semibold">Cashier:</span> cashier@canteen.com
            </button>
            <button 
              onClick={(e) => fillDemo(e, 'customer@canteen.com', 'password')}
              className="w-full text-left p-3 rounded-md bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm transition"
            >
              🤠 <span className="font-semibold">Customer:</span> customer@canteen.com
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;