import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Wrench,
  PlusCircle,
  Search,
  Users,
  LayoutDashboard,
  LogOut,
  User,
  Menu,
  X,
  Briefcase,
  ChevronDown,
  Sparkles,
  HelpCircle,
  Grid
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleDemo = async (role) => {
    await demoLogin(role);
    setUserDropdownOpen(false);
    setDemoDropdownOpen(false);
    setMobileMenuOpen(false);
    if (role === 'repairer') {
      navigate('/dashboard/repairer');
    } else {
      navigate('/dashboard/customer');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-semibold transition-all px-3 py-2 rounded-xl flex items-center gap-1.5 ${
      isActive
        ? 'text-teal-600 bg-teal-50/80 font-bold'
        : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/70'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Marketplace Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-navy-900 via-navy-700 to-teal-600 flex items-center justify-center text-white shadow-md shadow-navy-900/10 group-hover:scale-105 transition-transform">
              <Wrench className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-navy-900">
                Fix<span className="text-teal-600">Near</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase font-bold tracking-widest text-slate-400">
                Local Repair Marketplace
              </span>
            </div>
          </Link>

          {/* Center Marketplace Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/repairers" className={navLinkClass}>
              <Search className="w-4 h-4 text-slate-400" />
              Find Repairers
            </NavLink>
            <a href="/#categories" className="text-sm font-semibold text-slate-600 hover:text-navy-900 hover:bg-slate-100/70 transition-all px-3 py-2 rounded-xl flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-slate-400" />
              Categories
            </a>
            <a href="/#how-it-works" className="text-sm font-semibold text-slate-600 hover:text-navy-900 hover:bg-slate-100/70 transition-all px-3 py-2 rounded-xl flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              How It Works
            </a>

            {/* Role-Specific Shortcuts for Logged-In Users */}
            {isAuthenticated && user?.role === 'customer' && (
              <NavLink to="/dashboard/customer" className={navLinkClass}>
                <LayoutDashboard className="w-4 h-4 text-teal-600" />
                My Repairs
              </NavLink>
            )}

            {isAuthenticated && user?.role === 'repairer' && (
              <NavLink to="/dashboard/repairer" className={navLinkClass}>
                <LayoutDashboard className="w-4 h-4 text-teal-600" />
                Technician Hub
              </NavLink>
            )}
          </nav>

          {/* Right Action Bar & Marketplace CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Primary Action Button: Report a Problem / Post a Repair */}
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm hover:shadow-md transition-all group"
            >
              <PlusCircle className="w-4 h-4 text-teal-200 group-hover:rotate-90 transition-transform" />
              <span>Report a Problem</span>
            </Link>

            {/* Pro / Repairer Onboarding Link */}
            {!isAuthenticated && (
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-navy-900 hover:text-teal-600 hover:bg-slate-100/70 transition-colors"
              >
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Join as a Pro</span>
              </Link>
            )}

            {/* User Session Profile or Auth Links */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-navy-900 text-white font-bold text-xs flex items-center justify-center">
                    {user?.name ? user.name.charAt(0) : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-navy-900 leading-tight truncate max-w-[110px]">
                      {user?.name ? user.name.split(' ')[0] : 'User'}
                    </p>
                    <span className="text-[10px] font-semibold text-teal-600 capitalize">
                      {user?.role || 'Customer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-navy-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to={user?.role === 'repairer' ? '/dashboard/repairer' : '/dashboard/customer'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <LayoutDashboard className="w-4 h-4 text-teal-600" />
                      Dashboard
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-700 hover:text-navy-900 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold text-navy-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
                >
                  Register
                </Link>

                {/* Discrete Demo Quick-Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                    className="p-2 text-slate-400 hover:text-amber-500 hover:bg-slate-50 rounded-xl transition-colors"
                    title="Quick Demo Accounts"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  {demoDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                        Instant Demo Switch:
                      </p>
                      <button
                        onClick={() => handleDemo('customer')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition-colors flex items-center justify-between"
                      >
                        <span>Demo Customer</span>
                        <span className="text-[10px] text-teal-600 font-bold">Rohan</span>
                      </button>
                      <button
                        onClick={() => handleDemo('repairer')}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg font-medium text-slate-700 hover:bg-navy-50 hover:text-navy-900 transition-colors flex items-center justify-between"
                      >
                        <span>Demo Repairer</span>
                        <span className="text-[10px] text-navy-600 font-bold">Suresh</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/repairers"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <Search className="w-4 h-4 text-slate-400" />
            Find Repairers
          </NavLink>
          <NavLink
            to="/report"
            onClick={() => setMobileMenuOpen(false)}
            className={navLinkClass}
          >
            <PlusCircle className="w-4 h-4 text-teal-600" />
            Report a Problem
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink
                to={user?.role === 'repairer' ? '/dashboard/repairer' : '/dashboard/customer'}
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClass}
              >
                <LayoutDashboard className="w-4 h-4 text-teal-600" />
                Dashboard ({user?.role})
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-left px-3 py-2 text-sm font-semibold text-rose-600 rounded-xl hover:bg-rose-50"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user?.name})
              </button>
            </>
          ) : (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold text-navy-900 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 text-xs font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700"
                >
                  Register
                </Link>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => handleDemo('customer')}
                  className="flex-1 py-2 text-[11px] font-bold text-center bg-teal-50 text-teal-800 rounded-xl"
                >
                  Demo Customer
                </button>
                <button
                  onClick={() => handleDemo('repairer')}
                  className="flex-1 py-2 text-[11px] font-bold text-center bg-navy-50 text-navy-800 rounded-xl"
                >
                  Demo Repairer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
