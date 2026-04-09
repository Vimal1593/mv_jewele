import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('password123'); // Defaulted for scaffolding review UX
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        // Save the JWT locally
        localStorage.setItem('adminToken', data.token);
        // Direct to secure dashboard
        navigate('/admin');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Could not connect to authentication server');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-brand-cream text-brand-dark font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-serif text-brand-dark tracking-tight">
          Admin Terminal
        </h2>
        <p className="mt-2 text-center text-sm text-brand-gray tracking-widest uppercase">
          Authorized DevSecOps Personnel Only
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10 border border-[#E5E5E0]">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-sm font-medium border border-red-200">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs uppercase tracking-wider text-brand-gray mb-2">Username</label>
              <div className="mt-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border-b border-[#E5E5E0] focus:outline-none focus:border-brand-gold transition-colors bg-transparent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-brand-gray mb-2">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border-b border-[#E5E5E0] focus:outline-none focus:border-brand-gold transition-colors bg-transparent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 border border-transparent shadow-sm text-xs font-semibold tracking-[0.2em] uppercase text-white bg-brand-dark hover:bg-brand-gold focus:outline-none transition-colors duration-300 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Secure Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
