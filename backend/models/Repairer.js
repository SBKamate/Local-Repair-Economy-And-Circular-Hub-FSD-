const mongoose = require('mongoose');

const repairerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceCategories: [{
    type: String,
    enum: ['Furniture', 'Electronics', 'Home Appliances', 'Plumbing', 'Electrical', 'Other'],
    required: true,
  }],
  location: {
    type: String,
    required: [true, 'Location / Area is required'],
    trim: true,
  },
  experience: {
    type: String,
    default: '1+ years',
  },
  description: {
    type: String,
    default: 'Experienced repair technician specializing in circular refurbishment and fixing household equipment.',
  },
  availability: {
    type: String,
    enum: ['Available', 'Busy', 'On Leave'],
    default: 'Available',
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  estimatedCharges: {
    type: String,
    default: '₹200 - ₹500',
  },
  badge: {
    type: String,
    default: 'Verified Hub Partner',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Repairer', repairerSchema);
