import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const requirements = [
  { label: 'At least 6 characters', test: (p) => p.length >= 6 },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
];

export default function Register() {
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password || !form.confirm) {
      setError('Please fill in all fields');
      return;
    }
    if (!emailValid) {
      setError('Please enter a valid email address');
      return;
    }
    if (form.username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form.username.trim(), form.password, form.name.trim(), form.email.trim());
      addToast(`Account created! Welcome, ${user.name}! 🎉`);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Left Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: '#1A1A2E' }}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800&q=80"
            alt="bg" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }} />
        </div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-10"
          style={{ background: '#C9A84C', filter: 'blur(80px)' }} />

        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#C9A84C' }}>
              <span className="text-sm font-bold text-charcoal">SW</span>
            </div>
            <span className="font-display text-2xl font-bold text-white">ShopWave</span>
          </Link>

          <div>
            <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
              Join thousands of<br />
              <span className="gradient-text">happy shoppers.</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-8">
              Create your free account in seconds. No credit card required. No internet connection needed.
            </p>
            <div className="space-y-3">
              {['Free account, forever', 'Local storage — your data stays yours', 'Instant order history'].map(b => (
                <div key={b} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#C9A84C' }}>
                    <Check size={11} color="#1C1C1E" strokeWidth={3} />
                  </div>
                  <span className="text-white/70 text-sm">{b}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-xs">All data stored locally on your device.</p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#1C1C1E' }}>
              <span className="text-xs font-bold" style={{ color: '#C9A84C' }}>SW</span>
            </div>
            <span className="font-display text-xl font-semibold text-charcoal">ShopWave</span>
          </Link>

          <div className="mb-8 animate-slide-up">
            <h1 className="font-display text-3xl font-bold text-charcoal mb-2">Create account</h1>
            <p className="text-muted">Join ShopWave — it's completely free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up"
            style={{ animationDelay: '100ms', animationFillMode: 'both', opacity: 0 }}>
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-surface text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">@</span>
                <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })}
                  placeholder="your_username"
                  className="w-full pl-8 pr-4 py-3.5 rounded-2xl bg-white border border-surface text-sm focus:outline-none focus:border-accent transition-colors" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-surface text-sm focus:outline-none focus:border-accent transition-colors" />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border border-surface text-sm focus:outline-none focus:border-accent transition-colors pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 space-y-1">
                  {requirements.map(r => (
                    <div key={r.label} className={`flex items-center gap-2 text-xs transition-colors ${r.test(form.password) ? 'text-green-600' : 'text-muted'}`}>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${r.test(form.password) ? 'bg-green-100' : 'bg-surface'}`}>
                        {r.test(form.password) && <Check size={9} strokeWidth={3} />}
                      </div>
                      {r.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Confirm Password</label>
              <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })}
                placeholder="••••••••"
                className={`w-full px-4 py-3.5 rounded-2xl bg-white border text-sm focus:outline-none transition-colors ${
                  form.confirm && form.password !== form.confirm ? 'border-red-300 focus:border-red-400' : 'border-surface focus:border-accent'
                }`} />
              {form.confirm && form.password !== form.confirm && (
                <p className="text-xs text-red-500 mt-1.5">Passwords don't match</p>
              )}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-2xl text-sm font-medium animate-fade-in"
                style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold btn-shimmer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: '#1C1C1E', color: '#FAF8F5' }}>
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><UserPlus size={16} /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-8">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-charcoal hover:text-accent transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
