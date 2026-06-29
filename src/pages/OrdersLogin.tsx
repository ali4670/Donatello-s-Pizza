import { useState, useEffect, createContext, useContext, type ReactNode } from 'react';
import { Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface OrdersAuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
}

const OrdersAuthContext = createContext<OrdersAuthContextType | null>(null);

export function OrdersAuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setIsLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    setIsLoggedIn(true);
    return {};
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
  };

  return (
    <OrdersAuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </OrdersAuthContext.Provider>
  );
}

export function useOrdersAuth() {
  const ctx = useContext(OrdersAuthContext);
  if (!ctx) throw new Error('useOrdersAuth must be used within OrdersAuthProvider');
  return ctx;
}

export default function OrdersLogin() {
  const { login, isLoggedIn, isLoading } = useOrdersAuth();
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

  if (isLoggedIn) {
    window.location.href = '/orders';
    return null;
  }

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
      window.location.href = '/orders';
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amethyst-royal/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amethyst-lavender" />
          </div>
          <h1 className="font-podium text-white text-2xl uppercase tracking-tight">Orders Login</h1>
          <p className="text-amethyst-mauve/50 font-inter text-sm mt-2">Sign in to view orders</p>
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
