import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Clock, ShieldCheck, Check } from 'lucide-react';
import { bookingService } from '../services/api';

const BookingModal = ({ isOpen, onClose, repairer, customerRequests = [], onSuccess }) => {
  const [selectedRequestId, setSelectedRequestId] = useState(
    customerRequests.length > 0 ? customerRequests[0]._id : ''
  );
  const [scheduledDate, setScheduledDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [agreedPrice, setAgreedPrice] = useState(350);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (customerRequests && customerRequests.length > 0) {
      setSelectedRequestId(customerRequests[0]._id);
    }
  }, [customerRequests, isOpen]);

  if (!isOpen || !repairer) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequestId) {
      setError('Please select an active repair request or submit a new problem first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await bookingService.create({
        repairerId: repairer.userId?._id || repairer.userId || repairer._id,
        serviceRequestId: selectedRequestId,
        agreedPrice: Number(agreedPrice),
        scheduledDate,
        notes,
      });

      if (onSuccess) {
        onSuccess('Booking confirmed successfully with ' + (repairer.user?.name || repairer.userId?.name || 'repairer'));
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to confirm booking.');
    } finally {
      setLoading(false);
    }
  };

  const repairerName = repairer.user?.name || repairer.userId?.name || 'Local Repair Specialist';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-lg">
            {repairerName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-navy-900">Book Repair Service</h3>
            <p className="text-xs text-slate-500">with {repairerName} ({repairer.location})</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Your Repair Request
            </label>
            {customerRequests.length === 0 ? (
              <div className="text-xs p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
                You have no active repair requests. Please use the <strong>Report a Problem</strong> page to create one first.
              </div>
            ) : (
              <select
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              >
                {customerRequests.map((req) => (
                  <option key={req._id} value={req._id}>
                    [{req.category}] {req.description.slice(0, 50)}... ({req.status})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Visit Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Estimated Price (₹)
              </label>
              <input
                type="number"
                min="50"
                step="50"
                value={agreedPrice}
                onChange={(e) => setAgreedPrice(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Specific Instructions or Part Details
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g., Please bring extra wood adhesive and 2-inch stainless screws."
              className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" />
            <span>Circular Economy Protection: Pay only after inspection and repair is confirmed.</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || customerRequests.length === 0}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {loading ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
