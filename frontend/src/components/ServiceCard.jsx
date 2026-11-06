import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ServiceCard = ({ title, description, icon: Icon, color, count, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/report?category=${encodeURIComponent(title)}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-300 ${color}`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-navy-900 text-lg group-hover:text-teal-600 transition-colors">
            {title}
          </h3>
          {count && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {count}
            </span>
          )}
        </div>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs font-semibold text-teal-600 group-hover:text-teal-700 pt-2 border-t border-slate-100">
        <span>Request Repair</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default ServiceCard;
