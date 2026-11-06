const mongoose = require('mongoose');

const serviceRequestSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: '',
  },
  imagePublicId: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['Furniture', 'Electronics', 'Home Appliances', 'Plumbing', 'Electrical', 'Other'],
    required: [true, 'Category is required'],
  },
  description: {
    type: String,
    required: [true, 'Problem description is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
  },
  preferredDate: {
    type: String,
    required: [true, 'Preferred date is required'],
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  assignedRepairerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  assignedRepairerName: {
    type: String,
    default: '',
  },
  estimatedCost: {
    type: String,
    default: 'Awaiting Quote',
  },
  aiDiagnosis: {
    detectedCategory: String,
    confidence: Number,
    recommendedAction: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ServiceRequest', serviceRequestSchema);
