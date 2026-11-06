import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wrench,
  PlusCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  Leaf,
  PiggyBank,
  Sparkles,
  Cpu,
  Armchair,
  Tv,
  Droplet,
  Zap,
  Package,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';
import ServiceCard from '../components/ServiceCard';

const HomePage = () => {
  const categories = [
    {
      title: 'Furniture',
      description: 'Broken wooden chairs, dining tables, doors, cabinets, and antique restorations.',
      icon: Armchair,
      color: 'bg-amber-600',
      count: '32 Fixers',
    },
    {
      title: 'Electronics',
      description: 'Laptops, mobile phones, printed circuit boards (PCBs), monitors, and audio gear.',
      icon: Cpu,
      color: 'bg-blue-600',
      count: '48 Fixers',
    },
    {
      title: 'Home Appliances',
      description: 'Microwaves, refrigerators, washing machines, blenders, and vacuum cleaners.',
      icon: Tv,
      color: 'bg-teal-600',
      count: '40 Fixers',
    },
    {
      title: 'Plumbing',
      description: 'Pipe leaks, bathroom fittings, tap dripping, drain blockage, and valve seals.',
      icon: Droplet,
      color: 'bg-cyan-600',
      count: '29 Fixers',
    },
    {
      title: 'Electrical',
      description: 'Short circuits, faulty switchboards, power socket surges, and rewiring.',
      icon: Zap,
      color: 'bg-orange-600',
      count: '35 Fixers',
    },
    {
      title: 'Other',
      description: 'Bicycles, garden equipment, metal fittings, luggage wheels, and miscellaneous goods.',
      icon: Package,
      color: 'bg-slate-700',
      count: '18 Fixers',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Snap & Describe Problem',
      desc: 'Take a clear photo of your broken household item, select the category, and share your neighborhood location.',
    },
    {
      step: '02',
      title: 'Match Nearby Repairers',
      desc: 'FixNear matches your issue with verified local technicians based on proximity and category expertise.',
    },
    {
      step: '03',
      title: 'Repair, Reuse & Save',
      desc: 'Get your item restored, extend its lifecycle, save up to 70% compared to buying new, and prevent landfill waste.',
    },
  ];

  const benefits = [
    {
      icon: PiggyBank,
      title: 'Save up to 70% in Costs',
      desc: 'Fixing an existing appliance or chair is a fraction of the cost of purchasing a brand-new replacement.',
    },
    {
      icon: Leaf,
      title: 'Cut Carbon & E-Waste',
      desc: 'Every item repaired prevents up to 15 kg of carbon emissions and spares our soil from toxic electronic waste.',
    },
    {
      icon: HeartHandshakeIcon,
      title: 'Empower Local Craftsmen',
      desc: 'Your repair payments support neighborhood artisans, electricians, and independent repair workshops directly.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Safe Service',
      desc: 'Access verified technician profiles with peer reviews, transparent quotes, and direct contact.',
    },
  ];

  function HeartHandshakeIcon(props) {
    return <Award {...props} />;
  }

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white pt-16 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-6 lg:px-8 rounded-b-[2.5rem] shadow-xl">
        {/* Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>FixNear • Local Repair Economy & Circular Hub</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight sm:leading-none">
            Broken Something? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-emerald-400">
              We'll Help Fix It.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
            Connect with certified neighborhood repairers for damaged furniture, electronics, appliances, and home gear. Save money, extend product lifecycles, and protect our environment.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/report"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-base shadow-lg shadow-teal-900/40 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2.5 group"
            >
              <PlusCircle className="w-5 h-5 text-teal-200 group-hover:rotate-90 transition-transform" />
              <span>Report a Problem</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/repairers"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base backdrop-blur-sm transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 text-slate-300" />
              <span>Find Repair Services</span>
            </Link>
          </div>

          {/* Live Quick Stats Strip */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-teal-400">1,240+</p>
              <p className="text-xs text-slate-300 mt-1">Household Items Saved</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">70%</p>
              <p className="text-xs text-slate-300 mt-1">Average Cost Savings</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">18.6 Tons</p>
              <p className="text-xs text-slate-300 mt-1">E-Waste Prevented</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-2xl sm:text-3xl font-extrabold text-indigo-400">180+</p>
              <p className="text-xs text-slate-300 mt-1">Verified Local Artisans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Expertise Directory
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            What Needs Fixing Today?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Select a category below to instantly submit your repair request and get matched with experienced local technicians.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <ServiceCard key={idx} {...cat} />
          ))}
        </div>
      </section>

      {/* How FixNear Works */}
      <section id="how-it-works" className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              How FixNear Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A frictionless workflow designed to bring professional repairs right to your doorstep.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200/70 hover:shadow-soft transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-navy-900 text-teal-400 font-extrabold text-base flex items-center justify-center shadow-md">
                  {s.step}
                </div>
                <h3 className="text-xl font-bold text-navy-900">{s.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-900 text-white hover:bg-teal-600 font-bold text-sm transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Your Problem Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Repair Instead of Replace? (Circular Economy) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-4 mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-navy-700/80 px-3 py-1 rounded-full border border-teal-500/30">
              Circular Economy Hub
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Repair Instead of Replace?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Every year millions of repairable appliances, chairs, and electronics are dumped into landfills. FixNear promotes mindful consumption by rebuilding value locally.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {benefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-3 hover:bg-white/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-white">{b.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technician Onboarding Marketplace Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-navy-700">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 bg-navy-700/80 px-3 py-1 rounded-full border border-teal-500/30">
              For Independent Technicians
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Are You a Skilled Local Repairer?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Join FixNear's neighborhood circular network. Receive verified customer repair requests, set your own quotes, build your local reputation, and expand your service business.
            </p>
          </div>
          <Link
            to="/register"
            className="px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg whitespace-nowrap transition-all"
          >
            Join as a Service Partner
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
