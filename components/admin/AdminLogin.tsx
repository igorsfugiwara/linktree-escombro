// ============================================================
// VIEW LAYER — components/admin/AdminLogin.tsx
// Login screen for /admin route.
// ============================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminLogin: React.FC = () => {
  const { login, loginWithGoogle, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [shaking, setShaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) {
      navigate('/admin');
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    const ok = await loginWithGoogle();
    setSubmitting(false);
    if (ok) navigate('/admin');
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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-black border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-colors"
              style={{ borderRadius: '2px' }}
              placeholder="admin@escombro.com"
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
            disabled={submitting}
            className="w-full bg-brand-green text-brand-black font-black uppercase tracking-widest py-3 text-sm hover:bg-white transition-colors mt-2 disabled:opacity-50"
            style={{ borderRadius: '2px' }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-brand-black border-t-transparent rounded-full animate-spin inline-block" />
                Entrando...
              </span>
            ) : 'Entrar'}
          </button>
        </form>

        <div className="mt-3">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={submitting}
            className="w-full bg-transparent border border-white/20 text-white font-bold uppercase tracking-widest py-3 text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
            style={{ borderRadius: '2px' }}
          >
            Entrar com Google
          </button>
        </div>

        <p className="text-center text-neutral-700 text-xs mt-6 uppercase tracking-wider">
          Escombro HC © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
