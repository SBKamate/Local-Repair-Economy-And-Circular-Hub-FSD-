const express = require('express');
const router = express.Router();
const { getRepairers, getRepairerById, updateProfile } = require('../controllers/repairerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getRepairers);
router.get('/:id', getRepairerById);
router.put('/profile', protect, authorize('repairer', 'admin'), updateProfile);

module.exports = router;
