const Booking = require('../models/Booking');
const ServiceRequest = require('../models/ServiceRequest');
const { getDBStatus } = require('../config/db');
const mockDB = require('../services/mockDatabase');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res, next) => {
  try {
    const { repairerId, serviceRequestId, agreedPrice, scheduledDate, notes } = req.body;

    if (!repairerId || !serviceRequestId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both repairerId and serviceRequestId.',
      });
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const booking = await Booking.create({
        customerId: req.user._id,
        repairerId,
        serviceRequestId,
        agreedPrice: agreedPrice || 350,
        scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
        notes: notes || '',
        status: 'confirmed',
      });

      // Update ServiceRequest status to 'accepted'
      await ServiceRequest.findByIdAndUpdate(serviceRequestId, {
        status: 'accepted',
        assignedRepairerId: repairerId,
      });

      return res.status(201).json({
        success: true,
        message: 'Booking confirmed successfully!',
        data: booking,
      });
    } else {
      const newBooking = {
        _id: `bk_${Date.now()}`,
        customerId: req.user ? req.user._id : 'usr_cust_001',
        repairerId,
        serviceRequestId,
        agreedPrice: agreedPrice || 350,
        scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
        notes: notes || '',
        status: 'confirmed',
        createdAt: new Date(),
      };

      mockDB.bookings.unshift(newBooking);

      // Update mock request
      const reqItem = mockDB.requests.find((r) => r._id === serviceRequestId);
      if (reqItem) {
        reqItem.status = 'accepted';
        reqItem.assignedRepairerId = repairerId;
      }

      return res.status(201).json({
        success: true,
        message: 'Booking confirmed successfully! (Dev Database)',
        data: newBooking,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's bookings (Customer or Repairer)
// @route   GET /api/bookings/my
// @access  Private
exports.getMyBookings = async (req, res, next) => {
  try {
    const userId = req.user._id.toString();
    const userRole = req.user.role;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const query = userRole === 'repairer' ? { repairerId: req.user._id } : { customerId: req.user._id };
      const bookings = await Booking.find(query)
        .populate('customerId', 'name phone email')
        .populate('repairerId', 'name phone email')
        .populate('serviceRequestId')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } else {
      const bookings = mockDB.bookings.filter(
        (b) =>
          (userRole === 'repairer' && b.repairerId.toString() === userId) ||
          (userRole === 'customer' && b.customerId.toString() === userId)
      );

      return res.status(200).json({ success: true, count: bookings.length, data: bookings });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const booking = await Booking.findById(id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      booking.status = status;
      await booking.save();

      return res.status(200).json({ success: true, message: `Booking marked as ${status}`, data: booking });
    } else {
      const booking = mockDB.bookings.find((b) => b._id === id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }

      booking.status = status;
      return res.status(200).json({ success: true, message: `Booking marked as ${status}`, data: booking });
    }
  } catch (err) {
    next(err);
  }
};
