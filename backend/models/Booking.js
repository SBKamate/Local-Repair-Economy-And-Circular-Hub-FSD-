const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  repairerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceRequest',
    required: true,
  },
  agreedPrice: {
    type: Number,
    default: 350,
  },
  status: {
    type: String,
    enum: ['requested', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'confirmed',
  },
  scheduledDate: {
    type: String,
  },
  notes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Booking', bookingSchema);
