import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim() || !form.password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.username.trim(), form.password);
      addToast(`Welcome back, ${user.name || user.username}! 👋`);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Left - Decorative */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2" style={{ background: '#1C1C1E' }}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80"
            alt="bg" className="object-cover w-full h-full opacity-20" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #2D2D30 100%)' }} />
        </div>
        {/* Decorative blobs */}
        <div className="absolute rounded-full top-1/4 left-1/4 w-72 h-72 opacity-10"
          style={{ background: '#C9A84C', filter: 'blur(80px)' }} />
        <div className="absolute w-48 h-48 rounded-full bottom-1/4 right-1/4 opacity-10"
          style={{ background: '#60A5FA', filter: 'blur(60px)' }} />

        <div className="relative z-10 flex flex-col justify-between w-full p-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ background: '#C9A84C' }}>
              <span className="text-sm font-bold text-charcoal">SW</span>
            </div>
            <span className="text-2xl font-bold text-white font-display">ShopWave</span>
          </Link>

          <div>
            <h2 className="mb-4 text-4xl font-bold leading-tight text-white font-display">
              The future of shopping<br />
              <span className="gradient-text">starts here.</span>
            </h2>
            <p className="text-base leading-relaxed text-white/50">
              Premium tech products curated for those who demand the best. Sign in to unlock your personalized experience.
            </p>
          </div>

          <div className="flex gap-8 text-sm text-white/40">
            <span>15,000+ Products</span>
            <span>•</span>
            <span>2-Year Warranty</span>
            <span>•</span>
            <span>Free Returns</span>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex items-center justify-center w-full p-8 lg:w-1/2 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg" style={{ background: '#1C1C1E' }}>
              <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>SW</span>
            </div>
            <span className="text-xl font-semibold font-display text-charcoal">ShopWave</span>
          </Link>

          <div className="mb-10 animate-slide-up">
            <h1 className="mb-2 text-3xl font-bold font-display text-charcoal">Welcome back</h1>
            <p className="text-muted">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both', opacity: 0 }}>
            {/* Username */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-charcoal">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="your_username"
                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-surface text-sm focus:outline-none focus:border-accent transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-charcoal">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border border-surface text-sm focus:outline-none focus:border-accent transition-colors pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute transition-colors -translate-y-1/2 right-4 top-1/2 text-muted hover:text-charcoal">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted">Trouble signing in?</span>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="font-semibold text-accent transition-colors hover:text-charcoal"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 text-sm font-medium rounded-2xl animate-fade-in"
                style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold btn-shimmer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: '#1C1C1E', color: '#FAF8F5' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-muted animate-fade-in" style={{ animationDelay: '300ms' }}>
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold transition-colors text-charcoal hover:text-accent">
              Create one free
            </Link>
          </p>

          {/* Demo hint */}
          <div className="p-4 mt-6 text-center rounded-2xl bg-surface animate-fade-in" style={{ animationDelay: '400ms' }}>
            <p className="text-xs text-muted">
              <span className="font-semibold text-charcoal">New here?</span> Register first to create your account — all data is saved locally, no internet needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
