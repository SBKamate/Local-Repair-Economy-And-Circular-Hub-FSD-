const express = require('express');
const router = express.Router();
const {
  createRequest,
  getMyRequests,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Safe multer upload wrapper to capture upload errors and return 400 instead of 500
const safeUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.warn('⚠️ Multer upload warning:', err.message);
      return res.status(400).json({
        success: false,
        message: err.message || 'Error processing image upload. Please ensure image is under 10MB.',
      });
    }
    next();
  });
};

// Public or optionally authenticated to allow direct submission
router.route('/')
  .get(getAllRequests)
  .post(safeUpload, (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer') && !authHeader.includes('null') && !authHeader.includes('undefined')) {
      return protect(req, res, next);
    }
    next();
  }, createRequest);

router.get('/my', protect, getMyRequests);
router.route('/:id')
  .get(getRequestById)
  .delete(protect, deleteRequest);

router.put('/:id/status', protect, updateRequestStatus);

module.exports = router;
