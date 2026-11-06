import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  Trash2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Wrench,
  DollarSign
} from 'lucide-react';
import { requestService, bookingService } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [reqRes, bookRes] = await Promise.allSettled([
        requestService.getMyRequests(),
        bookingService.getMyBookings(),
      ]);

      if (reqRes.status === 'fulfilled' && reqRes.value.data) {
        setRequests(reqRes.value.data.data || []);
      }

      if (bookRes.status === 'fulfilled' && bookRes.value.data) {
        setBookings(bookRes.value.data.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteRequest = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and remove this repair request?')) return;
    try {
      await requestService.delete(id);
      setRequests(requests.filter((r) => r._id !== id));
      setNotification({ message: 'Repair request cancelled successfully.', type: 'success' });
    } catch (err) {
      setNotification({ message: err.message || 'Could not delete request.', type: 'error' });
    }
  };

  // Metric Computations
  const totalRequests = requests.length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;
  const acceptedRequests = requests.filter((r) => r.status === 'accepted' || r.status === 'in_progress').length;
  const completedRequests = requests.filter((r) => r.status === 'completed').length;

  // Tab Filtering
  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'accepted') return r.status === 'accepted' || r.status === 'in_progress';
    if (activeTab === 'completed') return r.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-10">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Customer Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight mt-2">
            Welcome back, {user?.name || 'Customer'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Track and manage your submitted repair requests, bookings, and local circular repairs.
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Requests</span>
            <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-navy-900">{totalRequests}</p>
          <span className="text-[11px] text-slate-400">All-time submissions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">{pendingRequests}</p>
          <span className="text-[11px] text-amber-600 font-medium">Awaiting technician match</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Accepted / In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">{acceptedRequests}</p>
          <span className="text-[11px] text-blue-600 font-medium">Active technician engagement</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed & Saved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{completedRequests}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Landfill items prevented</span>
        </div>
      </div>

      {/* Requests Tabs and List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
        {/* Tabs */}
        <div className="flex items-center gap-2 p-4 border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Requests ({totalRequests})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'pending'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pending ({pendingRequests})
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'accepted'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Accepted ({acceptedRequests})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'completed'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Completed ({completedRequests})
          </button>
        </div>

        {/* Requests Content */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-semibold text-slate-500">Retrieving repair requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center p-8 space-y-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-navy-900">No requests found in this tab</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Have a broken table, mixer, phone, or leaky tap? Report a problem to get connected with neighborhood fixers.
            </p>
            <Link
              to="/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Report a Problem</span>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="p-5 sm:p-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                    <img
                      src={
                        req.imageUrl ||
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={req.category}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Information */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-lg border border-teal-100">
                        {req.category}
                      </span>
                      <StatusBadge status={req.status} />
                      <span className="text-[11px] text-slate-400">
                        ID: {req._id.slice(-6)}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-navy-900 line-clamp-1">
                      {req.description}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {req.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Target: {req.preferredDate} ({req.preferredTime})
                      </span>
                      {req.assignedRepairerName && (
                        <span className="flex items-center gap-1 text-teal-700 font-semibold">
                          <Wrench className="w-3.5 h-3.5" />
                          Fixer: {req.assignedRepairerName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    to={`/request/${req._id}`}
                    className="px-3.5 py-2 text-xs font-semibold text-navy-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {req.status === 'pending' && (
                    <button
                      onClick={() => handleDeleteRequest(req._id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Cancel Request"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmed Bookings Section */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              <span>Confirmed Repair Bookings ({bookings.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-900">
                    Fixer: {booking.repairerId?.name || 'Local Specialist'}
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                    ₹{booking.agreedPrice}
                  </span>
                </div>
                <p className="text-slate-600">
                  Scheduled Date: <strong>{booking.scheduledDate || 'Tomorrow'}</strong>
                </p>
                {booking.notes && (
                  <p className="text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                    "{booking.notes}"
                  </p>
                )}
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Status: {booking.status}</span>
                  <span className="text-teal-700 font-medium">On-site diagnosis guaranteed</span>
                </div>
              </div>
            ))}
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

export default CustomerDashboard;
