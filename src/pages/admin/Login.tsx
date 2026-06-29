import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminLogin() {
  const { login, isLoggedIn, isLoading } = useAdmin();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amethyst-royal/30 border-t-amethyst-lavender rounded-full animate-spin" />
      </div>
    );
  }

  if (isLoggedIn) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    setError('');
    const result = await login(email.trim(), password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amethyst-royal/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amethyst-lavender" />
          </div>
          <h1 className="font-podium text-white text-2xl uppercase tracking-tight">Admin Login</h1>
          <p className="text-amethyst-mauve/50 font-inter text-sm mt-2">Sign in with your admin credentials</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amethyst-mauve/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="Email address"
              className={`w-full bg-amethyst-dark-2/50 border rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none transition-colors ${error ? 'border-red-500/60' : 'border-amethyst-royal/15 focus:border-amethyst-lavender/40'}`}
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              className={`w-full bg-amethyst-dark-2/50 border rounded-xl px-4 py-3.5 pr-12 text-sm text-white placeholder-amethyst-mauve/25 font-inter focus:outline-none transition-colors ${error ? 'border-red-500/60' : 'border-amethyst-royal/15 focus:border-amethyst-lavender/40'}`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-amethyst-mauve/40 hover:text-amethyst-mauve">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs font-inter">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amethyst-royal hover:bg-amethyst-velvet disabled:opacity-50 text-white py-3.5 text-xs tracking-widest uppercase font-inter rounded-xl transition-all duration-300"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
