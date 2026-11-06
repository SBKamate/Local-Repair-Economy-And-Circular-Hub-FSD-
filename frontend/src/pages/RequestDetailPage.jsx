import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Share2,
  Trash2,
  ShieldCheck,
  User,
  Phone
} from 'lucide-react';
import { requestService, bookingService, repairerService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import BookingModal from '../components/BookingModal';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';

const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRepairer, setSelectedRepairer] = useState(null);
  const [availableRepairers, setAvailableRepairers] = useState([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await requestService.getById(id);
        if (res.data && res.data.data) {
          setRequest(res.data.data);
          // Fetch repairers for matching category
          const repRes = await repairerService.getAll({ category: res.data.data.category });
          if (repRes.data && repRes.data.data) {
            setAvailableRepairers(repRes.data.data);
          }
        }
      } catch (err) {
        setError(err.message || 'Could not load request details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this repair request?')) return;
    try {
      await requestService.delete(id);
      navigate('/dashboard/customer');
    } catch (err) {
      setNotification({ message: err.message || 'Failed to delete request.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Loading request profile...</p>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-navy-900">Request Not Found</h2>
        <p className="text-xs text-slate-600">{error || 'The requested repair case does not exist.'}</p>
        <Link
          to="/dashboard/customer"
          className="inline-block px-5 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Problem Submitted', done: true },
    { label: 'Technician Assigned', done: request.status !== 'pending' },
    { label: 'Repair In Progress', done: request.status === 'in_progress' || request.status === 'completed' },
    { label: 'Restored & Complete', done: request.status === 'completed' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {request.status === 'pending' && (
            <button
              onClick={handleDelete}
              className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Cancel Request</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Request Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image */}
          <div className="bg-slate-950 p-4 sm:p-6 flex items-center justify-center min-h-[320px]">
            <img
              src={
                request.imageUrl ||
                'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'
              }
              alt={request.category}
              className="max-h-96 w-full object-contain rounded-xl"
            />
          </div>

          {/* Right: Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  {request.category}
                </span>
                <StatusBadge status={request.status} />
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-navy-900 leading-tight">
                {request.description}
              </h1>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">Location:</span> {request.location}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">Preferred Date:</span> {request.preferredDate} ({request.preferredTime})
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">Customer:</span> {request.customerName} ({request.customerPhone})
                </div>
              </div>

              {/* Estimate Pill */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Estimated Labor Quote:</span>
                <span className="font-extrabold text-navy-900 text-sm">{request.estimatedCost || 'Awaiting Inspection'}</span>
              </div>
            </div>

            {/* Circular Impact / AI Diagnostic Box */}
            <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200/80 text-xs text-teal-900 space-y-1.5">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Circular Economy Insights</span>
              </div>
              <p className="text-teal-800 leading-relaxed text-[11px]">
                {request.aiDiagnosis?.recommendedAction ||
                  'Refurbishment will preserve mechanical integrity and spare up to 14.5 kg of avoided carbon emissions.'}
              </p>
            </div>
          </div>
        </div>

        {/* Status Lifecycle Progress Bar */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs font-bold text-navy-900 uppercase tracking-wider mb-4">
            Repair Lifecycle Progress
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                  step.done
                    ? 'bg-teal-50 text-teal-900 border-teal-200 font-bold'
                    : 'bg-white text-slate-400 border-slate-200'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.done ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Matched Local Repairers Section */}
      {availableRepairers.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-teal-600" />
            <span>Recommended Repairers in Your Area for {request.category}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableRepairers.slice(0, 3).map((rep) => (
              <div
                key={rep._id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card flex flex-col justify-between space-y-3"
              >
                <div>
                  <h4 className="font-bold text-navy-900 text-sm">{rep.user?.name || rep.userId?.name || 'Local Fixer'}</h4>
                  <p className="text-xs text-slate-500">{rep.location}</p>
                  <p className="text-xs text-teal-700 font-semibold mt-1">
                    Est: {rep.estimatedCharges || '₹250 - ₹500'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedRepairer(rep);
                    setBookingModalOpen(true);
                  }}
                  className="w-full py-2 bg-navy-900 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                >
                  Book This Repairer
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {selectedRepairer && (
        <BookingModal
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
          repairer={selectedRepairer}
          customerRequests={[request]}
          onSuccess={(msg) => {
            setNotification({ message: msg, type: 'success' });
            setRequest((prev) => ({ ...prev, status: 'accepted' }));
          }}
        />
      )}

      {/* Toast Notification */}
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

export default RequestDetailPage;
