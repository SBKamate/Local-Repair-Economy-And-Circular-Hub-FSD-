const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/')
  .post(createBooking)
  .get(getMyBookings);

router.put('/:id/status', updateBookingStatus);

module.exports = router;
