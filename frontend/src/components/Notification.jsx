import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Notification = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    error: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-md flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-bounce-in ${
        styles[type] || styles.info
      }`}
    >
      {icons[type]}
      <div className="flex-1 text-sm font-medium">{message}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Notification;
