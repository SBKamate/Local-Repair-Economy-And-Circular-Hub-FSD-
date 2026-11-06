const express = require('express');
const router = express.Router();
const { analyzeImage } = require('../controllers/aiController');
const upload = require('../middleware/uploadMiddleware');

router.post('/analyze-image', upload.single('image'), analyzeImage);

module.exports = router;
