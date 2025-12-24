const express = require('express');
const router = express.Router();
const { getTestimonials, createTestimonial } = require('../controllers/testimonialController');
const { protect } = require('../middleware/auth');

router.get('/', getTestimonials);
router.post('/', protect, createTestimonial);

module.exports = router;
