import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  MapPin,
  Sparkles,
  Info,
  CheckCircle2,
  Users,
  AlertTriangle
} from 'lucide-react';
import { repairerService, requestService } from '../services/api';
import RepairerCard from '../components/RepairerCard';
import BookingModal from '../components/BookingModal';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';

const FindRepairersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [repairers, setRepairers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isFallbackData, setIsFallbackData] = useState(false);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [locationQuery, setLocationQuery] = useState(searchParams.get('location') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [availability, setAvailability] = useState('All');

  // Booking Modal
  const [selectedRepairerForBooking, setSelectedRepairerForBooking] = useState(null);
  const [customerRequests, setCustomerRequests] = useState([]);
  const [notification, setNotification] = useState({ message: '', type: 'info' });

  const categories = [
    'All',
    'Furniture',
    'Electronics',
    'Home Appliances',
    'Plumbing',
    'Electrical',
    'Other',
  ];

  const fetchRepairers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'All') params.category = selectedCategory;
      if (locationQuery) params.location = locationQuery;
      if (searchQuery) params.search = searchQuery;
      if (availability && availability !== 'All') params.availability = availability;

      const res = await repairerService.getAll(params);
      if (res.data && res.data.data) {
        setRepairers(res.data.data);
        setIsFallbackData(res.data.isFallbackData || false);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch repairers directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepairers();
  }, [selectedCategory, availability]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRepairers();
  };

  const handleOpenBooking = async (repairer) => {
    setSelectedRepairerForBooking(repairer);
    // Fetch customer's own active requests so they can pick one
    try {
      const res = await requestService.getMyRequests();
      if (res.data && res.data.data) {
        setCustomerRequests(res.data.data);
      }
    } catch (err) {
      // If not logged in, fetch general recent requests as sample
      try {
        const publicRes = await requestService.getAll();
        if (publicRes.data && publicRes.data.data) {
          setCustomerRequests(publicRes.data.data.slice(0, 3));
        }
      } catch (e) {
        setCustomerRequests([]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Neighborhood Network
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Find Local Repair Specialists
        </h1>
        <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
          Discover verified technicians near your neighborhood. Filter by expertise category, area, and real-time availability.
        </p>
      </div>

      {/* Notice Banner regarding Sample / Verified Data as requested in instructions */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Transparent Demonstration Notice:</p>
          <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
            {isFallbackData
              ? 'Displaying labeled development demonstration repairer profiles. Newly registered repairer accounts in MongoDB Atlas will seamlessly show up alongside.'
              : 'Connected to live database. Showing registered neighborhood technicians & certified circular economy hub partners.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-soft space-y-5">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <span className="text-xs font-bold text-navy-900 uppercase tracking-wider whitespace-nowrap mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-teal-600" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSearchParams({ category: cat });
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Inputs */}
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by fixer name, skill or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-4 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="Filter area (e.g. Koramangala, Indiranagar)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="sm:col-span-3 flex gap-2">
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Now</option>
              <option value="Busy">Busy</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Repairers List */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500">Scanning local repairers...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-center text-sm">
          {error}
        </div>
      ) : repairers.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-navy-900">No Repairers Found Matching Filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try choosing "All" categories or resetting the area search to view all nearby repairers.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setLocationQuery('');
              setSearchQuery('');
              setAvailability('All');
              fetchRepairers();
            }}
            className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-semibold hover:bg-teal-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repairers.map((repairer) => (
            <RepairerCard
              key={repairer._id}
              repairer={repairer}
              onBook={handleOpenBooking}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedRepairerForBooking && (
        <BookingModal
          isOpen={!!selectedRepairerForBooking}
          onClose={() => setSelectedRepairerForBooking(null)}
          repairer={selectedRepairerForBooking}
          customerRequests={customerRequests}
          onSuccess={(msg) => setNotification({ message: msg, type: 'success' })}
        />
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

export default FindRepairersPage;
