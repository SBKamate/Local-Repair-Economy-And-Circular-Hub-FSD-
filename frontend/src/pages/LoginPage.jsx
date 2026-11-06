import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Wrench, Eye, EyeOff, Lock, Mail, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (loggedUser.role === 'repairer') {
        navigate('/dashboard/repairer');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setLoading(true);
    setError('');
    try {
      const loggedUser = await demoLogin(role);
      if (role === 'repairer') {
        navigate('/dashboard/repairer');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (err) {
      setError('Could not complete demo login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-navy-900 to-teal-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Wrench className="w-6 h-6 text-teal-300" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Log In to FixNear
          </h1>
          <p className="text-xs text-slate-500">
            Access your repair dashboard, incoming jobs, and community hub.
          </p>
        </div>

        {/* Quick Demo Fillers for Reviewers */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-navy-900 text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Demo Switcher:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="py-1.5 px-2 bg-white hover:bg-teal-50 text-teal-800 rounded-xl font-bold border border-slate-200 shadow-xs transition-colors"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('repairer')}
              className="py-1.5 px-2 bg-white hover:bg-navy-50 text-navy-900 rounded-xl font-bold border border-slate-200 shadow-xs transition-colors"
            >
              Demo Repairer
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-teal-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
