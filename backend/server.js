const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB, getDBStatus } = require('./config/db');
const { isCloudinaryConfigured } = require('./config/cloudinary');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const repairerRoutes = require('./routes/repairerRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  // Connect to DB and settle connection before accepting requests
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 FixNear Server is running on http://localhost:${PORT}`);
    console.log(`📡 Healthcheck available at: http://localhost:${PORT}/api/health`);
  });
};

startServer();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration - support Vite default port 5173 and any local origin
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded local images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// System status & healthcheck endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getDBStatus();
  res.json({
    status: 'online',
    appName: 'FixNear – Local Repair Economy and Circular Hub',
    version: '1.0.0',
    database: dbStatus,
    storage: {
      provider: isCloudinaryConfigured ? 'Cloudinary (Cloud CDN)' : 'Local Disk (/uploads with Static URL)',
      isCloudinaryReady: isCloudinaryConfigured,
    },
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/repairers', repairerRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.send('FixNear API Server is running. Visit /api/health for system status.');
});

// Central Error Handler
app.use(errorHandler);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Error: ${err.message}`);
});
