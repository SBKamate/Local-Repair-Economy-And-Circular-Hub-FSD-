import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wrench,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Clock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [role, setRole] = useState('customer'); // 'customer' or 'repairer'

  // General fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Repairer specific
  const [serviceCategories, setServiceCategories] = useState(['Furniture']);
  const [location, setLocation] = useState('Koramangala, Bengaluru');
  const [experience, setExperience] = useState('3 years');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const allCategories = [
    'Furniture',
    'Electronics',
    'Home Appliances',
    'Plumbing',
    'Electrical',
    'Other',
  ];

  const toggleCategory = (cat) => {
    if (serviceCategories.includes(cat)) {
      if (serviceCategories.length > 1) {
        setServiceCategories(serviceCategories.filter((c) => c !== cat));
      }
    } else {
      setServiceCategories([...serviceCategories, cat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !phone) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name,
        email,
        password,
        phone,
        role,
      };

      if (role === 'repairer') {
        payload.serviceCategories = serviceCategories;
        payload.location = location;
        payload.experience = experience;
        payload.description =
          description || 'Certified neighborhood repair specialist dedicated to circular reuse.';
      }

      await register(payload);

      if (role === 'repairer') {
        navigate('/dashboard/repairer');
      } else {
        navigate('/dashboard/customer');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl max-w-xl w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-navy-900 to-teal-600 flex items-center justify-center text-white mx-auto shadow-md">
            <Wrench className="w-6 h-6 text-teal-300" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Create FixNear Account
          </h1>
          <p className="text-xs text-slate-500">
            Join our neighborhood circular economy & local repair network.
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'customer'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <User className="w-4 h-4 text-teal-600" />
            <span>I Need Repairs (Customer)</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('repairer')}
            className={`py-2.5 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'repairer'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-teal-600" />
            <span>I Am a Fixer (Technician)</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rohan Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohan@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
              Create Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
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

          {/* Repairer Additional Profile Configuration */}
          {role === 'repairer' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 animate-in fade-in">
              <p className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                Technician Profile Details
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Your Repair Skills (Multi-select)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {allCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        serviceCategories.includes(cat)
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Operating Area / City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="E.g., Koramangala, Bengaluru"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="E.g., 4 years"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Registering Account...' : 'Create Account'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-teal-600 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
