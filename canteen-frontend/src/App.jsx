import React from 'react';

function App() {
  // This is the function wrapper that was missing
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Canteen Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-orange-600 tracking-tight uppercase">
            Layno Canteen
          </h1>
          <p className="text-gray-500 font-medium">Management System</p>
        </div>

        <div className="bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Sign in to your account</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input 
                type="email" 
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input 
                type="password" 
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95">
              Sign In
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="mt-10">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4 text-center">
              Quick Demo Access
            </span>
            <div className="grid gap-2">
              <button type="button" className="flex justify-between items-center text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors">
                <span className="font-bold text-gray-700">👑 Admin</span>
                <code className="text-gray-400">admin@canteen.com</code>
              </button>
              <button type="button" className="flex justify-between items-center text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors">
                <span className="font-bold text-gray-700">💰 Cashier</span>
                <code className="text-gray-400">cashier@canteen.com</code>
              </button>
              <button type="button" className="flex justify-between items-center text-xs bg-gray-50 p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-colors">
                <span className="font-bold text-gray-700">🤠 Customer</span>
                <code className="text-gray-400">customer@canteen.com</code>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;