const Review = require('../models/Review');
const Repairer = require('../models/Repairer');
const { getDBStatus } = require('../config/db');
const mockDB = require('../services/mockDatabase');

// @desc    Add review for a repairer
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { repairerId, rating, comment } = req.body;

    if (!repairerId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide repairerId, rating, and comment.',
      });
    }

    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const review = await Review.create({
        customerId: req.user._id,
        repairerId,
        rating: Number(rating),
        comment,
      });

      // Recalculate average rating for repairer
      const allReviews = await Review.find({ repairerId });
      const avg = allReviews.reduce((acc, item) => item.rating + acc, 0) / allReviews.length;

      await Repairer.findOneAndUpdate(
        { userId: repairerId },
        { rating: Number(avg.toFixed(1)), totalReviews: allReviews.length }
      );

      return res.status(201).json({ success: true, message: 'Review submitted successfully', data: review });
    } else {
      const newReview = {
        _id: `rev_${Date.now()}`,
        customerId: req.user._id,
        customerName: req.user.name,
        repairerId,
        rating: Number(rating),
        comment,
        createdAt: new Date(),
      };
      mockDB.reviews.push(newReview);

      return res.status(201).json({ success: true, message: 'Review submitted successfully (Dev Database)', data: newReview });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get reviews for a repairer
// @route   GET /api/reviews/repairer/:id
// @access  Public
exports.getRepairerReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const reviews = await Review.find({ repairerId: id }).populate('customerId', 'name').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } else {
      const reviews = mockDB.reviews.filter((r) => r.repairerId === id);
      return res.status(200).json({ success: true, count: reviews.length, data: reviews });
    }
  } catch (err) {
    next(err);
  }
};
