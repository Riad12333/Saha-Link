const express = require('express');
const router = express.Router();
const {
    getBlogPosts,
    getBlogPost,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    getSpecialties,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty,
    submitContactForm,
    getPublicStats
} = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');

// Public stats
router.get('/stats', getPublicStats);

// Blog routes
router.get('/blog', getBlogPosts);
router.get('/blog/:slug', getBlogPost);
router.post('/blog', protect, authorize('admin', 'doctor'), createBlogPost);
router.put('/blog/:id', protect, authorize('admin', 'doctor'), updateBlogPost);
router.delete('/blog/:id', protect, authorize('admin', 'doctor'), deleteBlogPost);

// Specialty routes
router.get('/specialties', getSpecialties);
router.post('/specialties', protect, authorize('admin'), createSpecialty);
router.put('/specialties/:id', protect, authorize('admin'), updateSpecialty);
router.delete('/specialties/:id', protect, authorize('admin'), deleteSpecialty);

// Contact form
router.post('/contact', submitContactForm);

module.exports = router;
