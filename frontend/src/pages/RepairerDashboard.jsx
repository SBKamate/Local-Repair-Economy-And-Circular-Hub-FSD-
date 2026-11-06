import React, { useState, useEffect } from 'react';
import {
  Wrench,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Calendar,
  Phone,
  User,
  Star,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { requestService, repairerService, bookingService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';

const RepairerDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState(user?.repairerProfile || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  // Modal for accepting and providing quote
  const [quoteModalRequest, setQuoteModalRequest] = useState(null);
  const [estimatedQuote, setEstimatedQuote] = useState('₹350 - ₹500');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      // Repairer requests endpoint returns pending requests + requests assigned to this repairer
      const [reqRes, bookRes, repairerRes] = await Promise.allSettled([
        requestService.getAll(),
        bookingService.getMyBookings(),
        repairerService.getAll({ availability: 'All' }),
      ]);

      if (reqRes.status === 'fulfilled' && reqRes.value.data) {
        setRequests(reqRes.value.data.data || []);
      }

      if (bookRes.status === 'fulfilled' && bookRes.value.data) {
        setBookings(bookRes.value.data.data || []);
      }

      if (repairerRes.status === 'fulfilled' && repairerRes.value.data) {
        const currentUid = user?.id || user?._id;
        const found = repairerRes.value.data.data.find(
          (r) =>
            r.userId === currentUid ||
            r.userId?._id === currentUid ||
            r.userId?.id === currentUid ||
            r.user?._id === currentUid ||
            r.user?.id === currentUid
        );
        if (found) setProfile(found);
      }
    } catch (err) {
      setError(err.message || 'Failed to load repairer dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleUpdateStatus = async (requestId, newStatus, quote) => {
    try {
      const payload = { status: newStatus };
      if (quote) payload.estimatedCost = quote;

      await requestService.updateStatus(requestId, payload);

      setRequests((prev) =>
        prev.map((r) =>
          r._id === requestId
            ? { ...r, status: newStatus, estimatedCost: quote || r.estimatedCost, assignedRepairerName: user?.name }
            : r
        )
      );

      setNotification({
        message: `Service request #${requestId.slice(-6)} updated to '${newStatus}'.`,
        type: 'success',
      });
      setQuoteModalRequest(null);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to update request status.',
        type: 'error',
      });
    }
  };

  const handleToggleAvailability = async () => {
    const newStatus = profile?.availability === 'Available' ? 'Busy' : 'Available';
    try {
      await repairerService.updateProfile({ availability: newStatus });
      setProfile((prev) => ({ ...prev, availability: newStatus }));
      setNotification({
        message: `Your status is now updated to: ${newStatus}`,
        type: 'success',
      });
    } catch (err) {
      setNotification({ message: 'Could not update availability.', type: 'error' });
    }
  };

  // Metrics
  const incomingPending = requests.filter((r) => r.status === 'pending');
  const myAccepted = requests.filter((r) => r.status === 'accepted' || r.status === 'in_progress');
  const myCompleted = requests.filter((r) => r.status === 'completed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Technician Profile Card Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 rounded-3xl p-6 sm:p-8 text-white border border-navy-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-400 font-extrabold text-2xl flex items-center justify-center shadow-inner">
            {user?.name ? user.name.charAt(0) : 'R'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                {user?.name || 'Technician Portal'}
              </h1>
              <span className="text-xs bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Verified Hub Partner
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              {profile?.location || 'Bengaluru'} • Specializing in:{' '}
              {profile?.serviceCategories?.join(', ') || 'Household Repairs'}
            </p>
            <div className="flex items-center gap-4 text-xs text-amber-400 font-semibold pt-1">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {profile?.rating || 4.9} / 5.0 Rating
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">Exp: {profile?.experience || '5+ years'}</span>
            </div>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center gap-3 self-start md:self-center bg-navy-800/80 p-2.5 rounded-2xl border border-navy-700">
          <div className="text-right">
            <p className="text-xs font-bold text-slate-200">Current Status</p>
            <p
              className={`text-[11px] font-semibold ${
                profile?.availability === 'Available' ? 'text-teal-400' : 'text-amber-400'
              }`}
            >
              {profile?.availability || 'Available'}
            </p>
          </div>
          <button
            onClick={handleToggleAvailability}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              profile?.availability === 'Available'
                ? 'bg-teal-600 hover:bg-teal-500 text-white'
                : 'bg-amber-600 hover:bg-amber-500 text-white'
            }`}
          >
            Toggle Status
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <span className="text-xs font-semibold text-slate-500">Incoming Requests</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">{incomingPending.length}</p>
          <span className="text-[11px] text-slate-400">Neighborhood items awaiting quote</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <span className="text-xs font-semibold text-slate-500">Active Jobs</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">{myAccepted.length}</p>
          <span className="text-[11px] text-blue-600 font-medium">Under repair / accepted</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <span className="text-xs font-semibold text-slate-500">Restored & Completed</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{myCompleted.length}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Lifecycle extended</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <span className="text-xs font-semibold text-slate-500">Circular Impact</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-600">~68 kg</p>
          <span className="text-[11px] text-slate-400">Total estimated CO2 saved</span>
        </div>
      </div>

      {/* Incoming Requests Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span>Incoming Service Requests</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review customer damage descriptions, inspect product photos, and accept repair tasks.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {requests.length} Total Requests in Area
          </span>
        </div>

        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-500">Loading incoming requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-3">
            <p className="text-sm font-semibold text-navy-900">No requests currently in pipeline.</p>
            <p className="text-xs">Use the Report a Problem form to simulate a customer problem.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-slate-50/70 rounded-2xl border border-slate-200 p-5 space-y-4 flex flex-col justify-between hover:shadow-card transition-all"
              >
                <div className="space-y-3">
                  {/* Top Status & Category */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-teal-100/70 text-teal-800">
                      {req.category}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>

                  {/* Image & Description */}
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 border border-slate-200">
                      <img
                        src={
                          req.imageUrl ||
                          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
                        }
                        alt="Product problem"
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => window.open(req.imageUrl, '_blank')}
                      />
                    </div>
                    <div className="space-y-1.5 flex-1 text-xs">
                      <p className="font-semibold text-navy-900 text-sm leading-snug line-clamp-3">
                        {req.description}
                      </p>
                      <p className="text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {req.location}
                      </p>
                      <p className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Target: {req.preferredDate} ({req.preferredTime})
                      </p>
                    </div>
                  </div>

                  {/* Customer Info Box */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-400">Customer:</span>
                      <p className="font-bold text-navy-900">{req.customerName || 'Local Resident'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Phone:</span>
                      <p className="font-mono text-slate-700">{req.customerPhone || '+91 98765 43210'}</p>
                    </div>
                  </div>

                  {/* AI Diagnosis Pill */}
                  {req.aiDiagnosis && (
                    <div className="p-2.5 bg-teal-50/60 rounded-xl border border-teal-100 text-[11px] text-teal-900 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                      <span>{req.aiDiagnosis.recommendedAction}</span>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-slate-400">Estimate: </span>
                    <span className="font-bold text-navy-900">{req.estimatedCost || 'Quote Pending'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'pending' && (
                      <button
                        onClick={() => setQuoteModalRequest(req)}
                        className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Accept Job
                      </button>
                    )}

                    {req.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(req._id, 'in_progress')}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        Start Repair
                      </button>
                    )}

                    {req.status === 'in_progress' && (
                      <button
                        onClick={() => handleUpdateStatus(req._id, 'completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mark Restored
                      </button>
                    )}

                    {req.status !== 'completed' && req.status !== 'cancelled' && (
                      <button
                        onClick={() => handleUpdateStatus(req._id, 'cancelled')}
                        className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                      >
                        Decline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Accept & Quote Modal */}
      {quoteModalRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-lg font-bold text-navy-900">Accept Repair Request</h3>
            <p className="text-xs text-slate-600">
              Provide an initial estimated quote or labor cost for the customer:
            </p>

            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Estimated Service Charge (₹)
              </label>
              <input
                type="text"
                value={estimatedQuote}
                onChange={(e) => setEstimatedQuote(e.target.value)}
                placeholder="E.g., ₹350 - ₹500"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setQuoteModalRequest(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUpdateStatus(quoteModalRequest._id, 'accepted', estimatedQuote)
                }
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Confirm & Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification.message && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ message: '', type: 'info' })}
        />
      )}
    </div>
  );
};

export default RepairerDashboard;
