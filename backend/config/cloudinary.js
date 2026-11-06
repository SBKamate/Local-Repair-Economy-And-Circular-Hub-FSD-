const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ [Cloudinary Configured]: Remote cloud image uploads enabled.');
} else {
  console.log('ℹ️ [Storage Service]: Cloudinary credentials not detected in .env. Using local uploads directory (/uploads) with static URL delivery.');
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
};
