const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const mockDB = require('../services/mockDatabase');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    if (token === 'null' || token === 'undefined' || !token.trim()) {
      token = null;
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fixnear_super_secure_jwt_secret_key_2026_dev');
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      req.user = await User.findById(decoded.id).select('-password');
    } else {
      req.user = mockDB.users.find((u) => u._id === decoded.id);
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token verification failed.',
      error: err.message,
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
