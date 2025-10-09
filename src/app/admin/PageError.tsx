'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple login check
    if (email === 'ezekiel@example.com' && password === 'admin123') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen pt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Welcome to Admin Panel</h2>
            <p className="text-gray-600 mb-4">You are now logged in.</p>
            <button
              onClick={() => setIsLoggedIn(false)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Admin Login
          </h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="ezekiel@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="admin123"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Login
            </button>
            
            <p className="text-sm text-gray-600 text-center mt-4">
              Test credentials: ezekiel@example.com / admin123
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}