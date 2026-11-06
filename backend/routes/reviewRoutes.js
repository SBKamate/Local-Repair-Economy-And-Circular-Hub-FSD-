const express = require('express');
const router = express.Router();
const { createReview, getRepairerReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/repairer/:id', getRepairerReviews);

module.exports = router;
