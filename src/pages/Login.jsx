import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Atalhos para facilitar o login durante o desenvolvimento
    let loginEmail = email;
    if (email === 'admin') loginEmail = 'admin@example.com';
    if (email === 'suporte') loginEmail = 'suporte@helpdesk.pro';

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary mx-auto flex items-center justify-center text-3xl font-bold mb-4">
            H
          </div>
          <h1 className="text-headline-md font-bold text-primary">HelpDesk Pro</h1>
          <p className="text-on-surface-variant">Faça login para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-label-bold mb-2 text-on-surface">E-mail ou Usuário</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low border border-outline rounded-DEFAULT px-4 py-2 text-body-md focus:outline-none focus:border-primary"
              placeholder="admin@helpdesk.local ou admin"
              required
            />
          </div>
          
          <div>
            <label className="block text-label-bold mb-2 text-on-surface">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline rounded-DEFAULT px-4 py-2 text-body-md focus:outline-none focus:border-primary"
              placeholder="Senha (ex: admin123)"
              required
            />
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded text-body-md">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-on-primary font-label-bold py-3 rounded-DEFAULT hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
