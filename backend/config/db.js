const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fixnear';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 1500, // 1.5s fast fail for smooth dev fallback
    });
    isConnected = true;
    console.log(`✅ [MongoDB Connected]: ${conn.connection.host}`);
    const { seedInitialData } = require('./seedDB');
    await seedInitialData();
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ [MongoDB Connection Warning]: Could not connect to MongoDB at ${uri}.`);
    console.warn(`👉 [Fallback Mode]: FixNear is operating in Dev Mock Store mode with preloaded repairers & requests.`);
    console.warn(`👉 To connect real MongoDB: Set MONGODB_URI in backend/.env to your local MongoDB or MongoDB Atlas URI.`);
    return false;
  }
};

const getDBStatus = () => {
  const isReallyConnected = isConnected && mongoose.connection && mongoose.connection.readyState === 1;
  return {
    connected: isReallyConnected,
    type: isReallyConnected ? 'MongoDB (Mongoose)' : 'Development In-Memory Store (Auto-fallback)',
  };
};

module.exports = { connectDB, getDBStatus };
