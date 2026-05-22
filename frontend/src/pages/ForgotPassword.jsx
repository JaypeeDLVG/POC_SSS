import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/Toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmedEmail = email.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!emailValid) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('If that email is registered, a reset link has been sent.');
      navigate('/login');
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-cream">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/login" className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-accent hover:text-charcoal">
            <ArrowLeft size={16} /> Back to login
          </Link>

          <div className="mb-8 animate-slide-up">
            <h1 className="text-3xl font-bold font-display text-charcoal mb-2">Forgot password?</h1>
            <p className="text-muted">Enter your email and we’ll send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 animate-slide-up" style={{ animationDelay: '100ms', animationFillMode: 'both', opacity: 0 }}>
            <div>
              <label className="block mb-2 text-sm font-semibold text-charcoal">Email address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-surface text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 text-sm font-medium rounded-2xl animate-fade-in" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold btn-shimmer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: '#1C1C1E', color: '#FAF8F5' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />
              ) : (
                'Send reset link'
              )}
            </button>
          </form>

          <p className="mt-8 text-sm text-center text-muted">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-charcoal hover:text-accent">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2" style={{ background: '#1C1C1E' }}>
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80"
            alt="bg" className="object-cover w-full h-full opacity-20" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1C1C1E 0%, #2D2D30 100%)' }} />
        </div>
        <div className="absolute rounded-full top-1/4 left-1/4 w-72 h-72 opacity-10" style={{ background: '#C9A84C', filter: 'blur(80px)' }} />
        <div className="absolute w-48 h-48 rounded-full bottom-1/4 right-1/4 opacity-10" style={{ background: '#60A5FA', filter: 'blur(60px)' }} />
      </div>
    </div>
  );
}
