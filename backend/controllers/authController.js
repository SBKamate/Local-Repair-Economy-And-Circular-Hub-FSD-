const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Repairer = require('../models/Repairer');
const { getDBStatus } = require('../config/db');
const mockDB = require('../services/mockDatabase');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fixnear_super_secure_jwt_secret_key_2026_dev', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user (Customer or Repairer)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, serviceCategories, location, experience, description, estimatedCharges } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and phone number.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const userRole = role === 'repairer' ? 'repairer' : 'customer';
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      // Real MongoDB
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        phone,
        role: userRole,
      });

      let repairerProfile = null;
      if (userRole === 'repairer') {
        const categories = Array.isArray(serviceCategories) && serviceCategories.length > 0
          ? serviceCategories
          : ['Furniture'];

        repairerProfile = await Repairer.create({
          userId: user._id,
          serviceCategories: categories,
          location: location || 'Bengaluru',
          experience: experience || '2+ years',
          description: description || 'Specialized in circular refurbishing and quality household repairs.',
          estimatedCharges: estimatedCharges || '₹250 - ₹500',
        });
      }

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          repairerProfile,
        },
      });
    } else {
      // Mock In-Memory Store
      const userExists = mockDB.users.find((u) => u.email === normalizedEmail);
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newId = `usr_${Date.now()}`;
      const newUser = {
        _id: newId,
        name,
        email: normalizedEmail,
        password: hashedPassword,
        phone,
        role: userRole,
        createdAt: new Date(),
      };

      mockDB.users.push(newUser);

      let repairerProfile = null;
      if (userRole === 'repairer') {
        const categories = Array.isArray(serviceCategories) && serviceCategories.length > 0
          ? serviceCategories
          : ['Furniture'];

        repairerProfile = {
          _id: `rep_${Date.now()}`,
          userId: newId,
          user: newUser,
          serviceCategories: categories,
          location: location || 'Bengaluru',
          experience: experience || '2+ years',
          description: description || 'Specialized in circular refurbishing and quality household repairs.',
          availability: 'Available',
          rating: 5.0,
          totalReviews: 1,
          estimatedCharges: estimatedCharges || '₹250 - ₹500',
          badge: 'Verified Hub Partner',
        };
        mockDB.repairers.push(repairerProfile);
      }

      const token = generateToken(newUser._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          repairerProfile,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      let repairerProfile = null;
      if (user.role === 'repairer') {
        repairerProfile = await Repairer.findOne({ userId: user._id });
      }

      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          repairerProfile,
        },
      });
    } else {
      const user = mockDB.users.find((u) => u.email === normalizedEmail);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password credentials.',
        });
      }

      let repairerProfile = null;
      if (user.role === 'repairer') {
        repairerProfile = mockDB.repairers.find((r) => r.userId === user._id);
      }

      const token = generateToken(user._id);

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          repairerProfile,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();
    let repairerProfile = null;

    if (dbStatus.connected) {
      if (req.user.role === 'repairer') {
        repairerProfile = await Repairer.findOne({ userId: req.user._id });
      }
    } else {
      if (req.user.role === 'repairer') {
        repairerProfile = mockDB.repairers.find((r) => r.userId === req.user._id);
      }
    }

    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        role: req.user.role,
        repairerProfile,
      },
    });
  } catch (err) {
    next(err);
  }
};
