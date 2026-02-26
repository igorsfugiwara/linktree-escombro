// ============================================================
// VIEW LAYER — components/admin/AdminLogin.tsx
// Login screen for /admin route.
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminLogin: React.FC = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = login(username, password);
    if (ok) {
      navigate('/admin');
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/rocky-wall.png)' }}
      />

      <div
        className={`relative w-full max-w-sm bg-neutral-900 border border-white/10 p-8 ${shaking ? 'animate-shake' : ''}`}
        style={{ borderRadius: '2px' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/assets/logo_branco_2.png" alt="Escombro" className="w-32 mx-auto mb-4 opacity-90" />
          <p className="text-neutral-500 text-xs uppercase tracking-widest font-bold">Painel Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoComplete="username"
              className="w-full bg-black border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
              style={{ borderRadius: '2px' }}
              placeholder="usuário"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-black border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
              style={{ borderRadius: '2px' }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs font-bold uppercase tracking-wider">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-brand-green text-brand-black font-black uppercase tracking-widest py-3 text-sm hover:bg-white transition-colors mt-2"
            style={{ borderRadius: '2px' }}
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-neutral-700 text-xs mt-6 uppercase tracking-wider">
          Escombro HC © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
