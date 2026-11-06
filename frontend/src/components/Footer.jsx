import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Recycle, HeartHandshake, ShieldCheck, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-navy-900 text-white pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-700/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                Fix<span className="text-teal-400">Near</span>
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              FixNear is a sustainable circular economy platform dedicated to reviving damaged household goods, empowering local repair technicians, and reducing landfill waste.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-teal-300 bg-navy-800/80 px-3 py-1.5 rounded-lg border border-navy-700">
                <Recycle className="w-4 h-4 text-teal-400" />
                <span>Circular Economy Hub</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-300 bg-navy-800/80 px-3 py-1.5 rounded-lg border border-navy-700">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Hyperlocal Artisans</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400">Platform</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-white transition-colors">Report a Problem</Link>
              </li>
              <li>
                <Link to="/repairers" className="hover:text-white transition-colors">Find Local Repairers</Link>
              </li>
              <li>
                <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="/#categories" className="hover:text-white transition-colors">Browse Services</a>
              </li>
            </ul>
          </div>

          {/* Repair Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400">Categories</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/report?category=Furniture" className="hover:text-white transition-colors">Wood & Furniture Restoration</Link></li>
              <li><Link to="/report?category=Electronics" className="hover:text-white transition-colors">Electronics & Motherboards</Link></li>
              <li><Link to="/report?category=Home%20Appliances" className="hover:text-white transition-colors">Home & Kitchen Appliances</Link></li>
              <li><Link to="/report?category=Plumbing" className="hover:text-white transition-colors">Plumbing & Water Leakage</Link></li>
              <li><Link to="/report?category=Electrical" className="hover:text-white transition-colors">Electrical Wiring & Switches</Link></li>
            </ul>
          </div>

          {/* For Technicians */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-teal-400">For Technicians</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><Link to="/register" className="hover:text-white transition-colors">Join as a Service Partner</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Technician Portal Login</Link></li>
              <li><span className="text-slate-400">Verified Hub Standards</span></li>
              <li><span className="text-slate-400">Circular Repair Guarantee</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 FixNear Platform. Empowering Sustainable Communities through Local Repair.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              Verified Local Hub
            </span>
            <span className="text-slate-500">•</span>
            <span>Zero Landfill Mission</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
