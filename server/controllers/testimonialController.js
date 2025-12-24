const Testimonial = require('../models/Testimonial');

// @desc    Get all testimonials for homepage
// @route   GET /api/testimonials
// @access  Public
exports.getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ showOnHomepage: true })
            .populate('user', 'name avatar city')
            .sort('-createdAt')
            .limit(6);

        res.json({
            success: true,
            data: testimonials
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private
exports.createTestimonial = async (req, res) => {
    try {
        const { content, rating } = req.body;

        const testimonial = await Testimonial.create({
            user: req.user.id,
            content,
            rating
        });

        const populated = await Testimonial.findById(testimonial._id)
            .populate('user', 'name avatar city');

        res.status(201).json({
            success: true,
            data: populated
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
