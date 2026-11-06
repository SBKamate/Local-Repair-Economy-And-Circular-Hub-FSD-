import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  X,
  RefreshCw,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { requestService, aiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReportProblemPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const fileInputRef = useRef(null);

  // Form states
  const [category, setCategory] = useState(searchParams.get('category') || 'Furniture');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Koramangala, Bengaluru');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('Morning (09:00 AM - 12:00 PM)');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState(null);

  // AI Diagnostic modular preview
  const [aiPreview, setAiPreview] = useState({
    circularScore: 88,
    carbonSavings: '14.2 kg CO2',
    tip: 'Repairing instead of replacing prevents toxic e-waste & saves raw timber.',
  });

  useEffect(() => {
    if (searchParams.get('category')) {
      setCategory(searchParams.get('category'));
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Handle image selection
  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPEG, PNG, WEBP, or GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file size must be less than 10MB.');
      return;
    }

    setError('');
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!category) {
      setError('Please select a product category.');
      return;
    }

    if (!description.trim() || description.trim().length < 10) {
      setError('Please provide a descriptive explanation of the problem (at least 10 characters).');
      return;
    }

    if (!location.trim()) {
      setError('Please enter your neighborhood location.');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('preferredDate', preferredDate);
      formData.append('preferredTime', preferredTime);
      formData.append('customerName', customerName || (user ? user.name : 'FixNear Customer'));
      formData.append('customerPhone', customerPhone || (user ? user.phone : '+91 98765 43210'));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const res = await requestService.create(formData);

      if (res.data && res.data.success) {
        setSubmittedRequest(res.data.data);
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      const errorMsg =
        err.message ||
        (err.response && err.response.data && err.response.data.message) ||
        'Failed to submit repair request. Please ensure the backend server is running on port 5001.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Furniture',
    'Electronics',
    'Home Appliances',
    'Plumbing',
    'Electrical',
    'Other',
  ];

  // Success Confirmation Screen
  if (submittedRequest) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Repair Request Submitted!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your damaged product report has been registered in the FixNear Circular Network. Local repairers in{' '}
              <strong className="text-navy-900">{submittedRequest.location}</strong> have been notified.
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Request Reference</span>
              <span className="font-mono font-bold text-navy-900">{submittedRequest._id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Category:</span>
              <span className="font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {submittedRequest.category}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Preferred Date:</span>
              <span className="font-semibold text-slate-800">{submittedRequest.preferredDate}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Estimated Circular Saving:</span>
              <span className="font-semibold text-emerald-700">~14.5 kg CO2 avoided</span>
            </div>
          </div>

          {submittedRequest.imageUrl && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-56">
              <img
                src={submittedRequest.imageUrl}
                alt="Uploaded item"
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/dashboard/customer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-900 text-white font-bold text-xs sm:text-sm hover:bg-teal-600 transition-colors shadow-md"
            >
              View in Customer Dashboard
            </Link>
            <Link
              to={`/repairers?category=${encodeURIComponent(submittedRequest.category)}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 font-bold text-xs sm:text-sm transition-colors border border-teal-200 flex items-center justify-center gap-1.5"
            >
              <span>Browse Matched Repairers</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
          Step 1: Problem Intake
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
          Report a Damaged Product
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Upload a photo and details of your broken furniture, electronics, or appliance. We'll connect you with local neighborhood fixers.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-800 text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-soft space-y-8">
        {/* Section 1: Image Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-navy-900">
            Upload Photo of Damaged Product
            <span className="text-slate-400 font-normal ml-1.5 text-xs">
              (Helps technicians assess parts, tools, & pricing)
            </span>
          </label>

          {!imagePreview ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-teal-500 bg-teal-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-teal-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
                <Upload className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-800">
                  <span className="text-teal-600 underline">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-slate-500">
                  Supported formats: JPEG, PNG, WEBP (Max size: 10MB)
                </p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-full h-64 sm:h-80 object-contain bg-slate-950"
              />
              <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white text-navy-900 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-slate-100 shadow-md transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Replace Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-4 py-2 bg-rose-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-rose-700 shadow-md transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
          />
        </div>

        {/* Section 2: Category and Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Product Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              required
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Your Location / Neighborhood <span className="text-rose-500">*</span></span>
              <button
                type="button"
                onClick={() => setLocation('Koramangala, Bengaluru')}
                className="text-[11px] font-semibold text-teal-600 hover:underline"
              >
                Use Bengaluru Central
              </button>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="E.g., Koramangala 4th Block, Bengaluru"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Problem Description */}
        <div>
          <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
            Problem Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what is damaged, how it happened, and what needs fixing (e.g., Wooden dining chair leg fractured at base joint; needs re-gluing and dowel bracket bracing)."
            className="w-full p-4 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all leading-relaxed"
            required
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Minimum 10 characters. Clear explanations help repairers arrive with exact spare parts.
          </p>
        </div>

        {/* Section 4: Preferred Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Preferred Repair Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Preferred Time Slot
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              >
                <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                <option value="Flexible / Any Time">Flexible / Any Time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Customer Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="E.g., Rohan Sharma"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-2">
              Contact Phone Number
            </label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="E.g., +91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>
        </div>

        {/* Section 6: Future AI & Circular Hub Integration Info Pill */}
        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-900 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">
              Circular Economy Diagnostic Hook Active
            </p>
            <p className="text-teal-800 leading-relaxed">
              Repairing this {category.toLowerCase()} item saves an estimated <strong>{aiPreview.carbonSavings}</strong> and prevents unnecessary recycling energy. (Computer Vision multimodal AI classifier is modularly prepared at <code>/api/ai/analyze-image</code>).
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-teal-700/20 hover:shadow-teal-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading & Submitting...</span>
              </>
            ) : (
              <>
                <span>Submit Repair Request</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportProblemPage;
