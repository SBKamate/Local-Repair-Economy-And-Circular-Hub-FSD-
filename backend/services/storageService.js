const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const fs = require('fs');

/**
 * Upload an image file to Cloudinary if configured,
 * otherwise fall back to local disk URL.
 *
 * @param {Object} file - Multer file object
 * @param {Object} req - Express request object (to construct host URL)
 * @returns {Promise<{ url: string, publicId: string, provider: string }>}
 */
const uploadImage = async (file, req) => {
  if (!file) {
    return {
      url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
      publicId: '',
      provider: 'default',
    };
  }

  // If Cloudinary is configured, upload to Cloudinary
  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'fixnear_damage_reports',
        use_filename: true,
        unique_filename: true,
      });

      // Remove local temp file after cloud upload
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.warn('Could not remove temporary local upload file:', err.message);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id,
        provider: 'cloudinary',
      };
    } catch (err) {
      console.error('Cloudinary upload failed, falling back to local file storage:', err.message);
    }
  }

  // Local storage fallback: serve via Express static route
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:5000';
  const localUrl = `${protocol}://${host}/uploads/${file.filename}`;

  return {
    url: localUrl,
    publicId: file.filename,
    provider: 'local-disk',
  };
};

module.exports = {
  uploadImage,
};
