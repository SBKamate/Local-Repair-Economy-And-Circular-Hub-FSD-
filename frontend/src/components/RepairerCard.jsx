import React from 'react';
import { Star, MapPin, Wrench, Clock, CheckCircle2, Award } from 'lucide-react';

const RepairerCard = ({ repairer, onBook }) => {
  const name = repairer.user?.name || repairer.userId?.name || 'Local Fixer';
  const phone = repairer.user?.phone || repairer.userId?.phone || '';
  const email = repairer.user?.email || repairer.userId?.email || '';

  const getInitials = (n) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const isAvailable = repairer.availability === 'Available';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-hover transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-navy-900 to-navy-600 text-white font-bold flex items-center justify-center text-sm shadow-sm group-hover:scale-105 transition-transform">
              {getInitials(name)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-bold text-navy-900 text-base leading-snug">{name}</h4>
                <Award className="w-4 h-4 text-teal-600" title="Verified Hub Partner" />
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate max-w-[180px]">{repairer.location}</span>
              </div>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
              isAvailable
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            {repairer.availability || 'Available'}
          </span>
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {repairer.serviceCategories?.map((cat, idx) => (
            <span
              key={idx}
              className="text-xs px-2.5 py-0.5 rounded-lg bg-teal-50 text-teal-800 font-medium border border-teal-100"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {repairer.description || 'Experienced in repairing household electronics, appliances, and circular refurbishment.'}
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl text-xs mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500">Exp:</span>
            <span className="font-semibold text-slate-800">{repairer.experience || '2+ yrs'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-sans">Est:</span>
            <span className="font-semibold text-slate-800 truncate">{repairer.estimatedCharges || '₹250 - ₹500'}</span>
          </div>
        </div>
      </div>

      {/* Footer & CTA */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
          <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
          <span>{repairer.rating || 4.8}</span>
          <span className="text-slate-400 font-normal text-xs">({repairer.totalReviews || 12})</span>
        </div>

        <button
          onClick={() => onBook(repairer)}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-navy-900 text-white hover:bg-teal-600 transition-colors shadow-sm flex items-center gap-1.5"
        >
          <Wrench className="w-3.5 h-3.5" />
          Book Repair
        </button>
      </div>
    </div>
  );
};

export default RepairerCard;
