const errorHandler = (err, req, res, next) => {
  console.error(`❌ [Error]: ${err.message}`, err);

  // Multer file upload errors
  if (err.name === 'MulterError') {
    return res.status(400).json({ success: false, message: `Image upload error: ${err.message}` });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    return res.status(404).json({ success: false, message });
  }

  // Mongoose duplicate key (support both err.code and MongoDB v6 err.errorResponse.code)
  if (err.code === 11000 || (err.errorResponse && err.errorResponse.code === 11000)) {
    const message = 'An account with this email address already exists. Please log in instead.';
    return res.status(400).json({ success: false, message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server Error occurred.',
  });
};

module.exports = errorHandler;
