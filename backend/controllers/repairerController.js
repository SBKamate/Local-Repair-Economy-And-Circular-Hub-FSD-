const Repairer = require('../models/Repairer');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const mockDB = require('../services/mockDatabase');

// @desc    Get all repairers with category & location filtering
// @route   GET /api/repairers
// @access  Public
exports.getRepairers = async (req, res, next) => {
  try {
    const { category, location, search, availability } = req.query;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const query = {};

      if (category && category !== 'All') {
        query.serviceCategories = { $in: [category] };
      }

      if (location) {
        query.location = { $regex: location, $options: 'i' };
      }

      if (availability && availability !== 'All') {
        query.availability = availability;
      }

      let repairers = await Repairer.find(query).populate('userId', 'name email phone');

      if (search) {
        const q = search.toLowerCase();
        repairers = repairers.filter(
          (r) =>
            (r.userId && r.userId.name.toLowerCase().includes(q)) ||
            r.location.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
        );
      }

      return res.status(200).json({
        success: true,
        count: repairers.length,
        isFallbackData: false,
        data: repairers,
      });
    } else {
      let results = [...mockDB.repairers];

      if (category && category !== 'All') {
        results = results.filter((r) =>
          r.serviceCategories.some((c) => c.toLowerCase() === category.toLowerCase())
        );
      }

      if (location) {
        results = results.filter((r) =>
          r.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (availability && availability !== 'All') {
        results = results.filter((r) =>
          r.availability.toLowerCase() === availability.toLowerCase()
        );
      }

      if (search) {
        const q = search.toLowerCase();
        results = results.filter(
          (r) =>
            (r.user && r.user.name.toLowerCase().includes(q)) ||
            r.location.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q)
        );
      }

      return res.status(200).json({
        success: true,
        count: results.length,
        isFallbackData: true,
        data: results,
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get repairer profile by ID
// @route   GET /api/repairers/:id
// @access  Public
exports.getRepairerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const repairer = await Repairer.findById(id).populate('userId', 'name email phone');
      if (!repairer) {
        return res.status(404).json({ success: false, message: 'Repairer profile not found' });
      }
      return res.status(200).json({ success: true, data: repairer });
    } else {
      const repairer = mockDB.repairers.find((r) => r._id === id || r.userId === id);
      if (!repairer) {
        return res.status(404).json({ success: false, message: 'Repairer profile not found' });
      }
      return res.status(200).json({ success: true, data: repairer });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Update repairer profile
// @route   PUT /api/repairers/profile
// @access  Private (Repairer only)
exports.updateProfile = async (req, res, next) => {
  try {
    const { serviceCategories, location, experience, description, availability, estimatedCharges } = req.body;
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      let profile = await Repairer.findOne({ userId: req.user._id });

      if (!profile) {
        profile = new Repairer({ userId: req.user._id });
      }

      if (serviceCategories) profile.serviceCategories = serviceCategories;
      if (location) profile.location = location;
      if (experience) profile.experience = experience;
      if (description) profile.description = description;
      if (availability) profile.availability = availability;
      if (estimatedCharges) profile.estimatedCharges = estimatedCharges;

      await profile.save();
      return res.status(200).json({ success: true, message: 'Profile updated successfully', data: profile });
    } else {
      let profile = mockDB.repairers.find((r) => r.userId === req.user._id);

      if (!profile) {
        profile = {
          _id: `rep_${Date.now()}`,
          userId: req.user._id,
          user: req.user,
        };
        mockDB.repairers.push(profile);
      }

      if (serviceCategories) profile.serviceCategories = serviceCategories;
      if (location) profile.location = location;
      if (experience) profile.experience = experience;
      if (description) profile.description = description;
      if (availability) profile.availability = availability;
      if (estimatedCharges) profile.estimatedCharges = estimatedCharges;

      return res.status(200).json({ success: true, message: 'Profile updated successfully', data: profile });
    }
  } catch (err) {
    next(err);
  }
};
