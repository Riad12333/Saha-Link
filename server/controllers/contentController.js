const BlogPost = require('../models/BlogPost');
const Specialty = require('../models/Specialty');
const ContactForm = require('../models/ContactForm');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
exports.getBlogPosts = async (req, res) => {
    try {
        const { category, page = 1, limit = 10, search } = req.query;
        const skip = (page - 1) * limit;

        let query = { isPublished: true };

        // Admin can see unpublished posts
        if (req.user && req.user.role === 'admin') {
            delete query.isPublished;
        }

        if (category) {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await BlogPost.find(query)
            .populate('author', 'name avatar')
            .limit(parseInt(limit))
            .skip(skip)
            .sort('-createdAt');

        const total = await BlogPost.countDocuments(query);

        res.json({
            success: true,
            count: posts.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: posts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single blog post
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlogPost = async (req, res) => {
    try {
        const post = await BlogPost.findOne({ slug: req.params.slug })
            .populate('author', 'name avatar');

        if (!post) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        // Increment views
        post.views += 1;
        await post.save();

        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create blog post
// @route   POST /api/blog
// @access  Private (Admin/Doctor)
exports.createBlogPost = async (req, res) => {
    try {
        const { title, content, excerpt, category, image, tags, isPublished } = req.body;

        const post = await BlogPost.create({
            title,
            content,
            excerpt,
            category,
            image,
            tags,
            isPublished: isPublished !== undefined ? isPublished : false,
            author: req.user.id
        });

        res.status(201).json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private (Admin/Author)
exports.updateBlogPost = async (req, res) => {
    try {
        let post = await BlogPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        // Check ownership or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private (Admin/Author)
exports.deleteBlogPost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Blog post not found' });
        }

        // Check ownership or admin
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await post.deleteOne();

        res.json({ success: true, message: 'Blog post removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all specialties
// @route   GET /api/specialties
// @access  Public
exports.getSpecialties = async (req, res) => {
    try {
        const specialties = await Specialty.find().sort('name');
        res.json({ success: true, count: specialties.length, data: specialties });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create specialty
// @route   POST /api/specialties
// @access  Private (Admin only)
exports.createSpecialty = async (req, res) => {
    try {
        const specialty = await Specialty.create(req.body);
        res.status(201).json({ success: true, data: specialty });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update specialty
// @route   PUT /api/specialties/:id
// @access  Private (Admin only)
exports.updateSpecialty = async (req, res) => {
    try {
        const specialty = await Specialty.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!specialty) {
            return res.status(404).json({ success: false, message: 'Specialty not found' });
        }

        res.json({ success: true, data: specialty });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete specialty
// @route   DELETE /api/specialties/:id
// @access  Private (Admin only)
exports.deleteSpecialty = async (req, res) => {
    try {
        const specialty = await Specialty.findById(req.params.id);

        if (!specialty) {
            return res.status(404).json({ success: false, message: 'Specialty not found' });
        }

        await specialty.deleteOne();
        res.json({ success: true, message: 'Specialty removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const contact = await ContactForm.create({
            name,
            email,
            phone,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully',
            data: contact
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Get public stats for home page
// @route   GET /api/stats
// @access  Public
exports.getPublicStats = async (req, res) => {
    try {
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await Doctor.countDocuments({ isApproved: true });
        const totalSpecialties = await Specialty.countDocuments();
        const totalAppointments = await Appointment.countDocuments({ status: 'completed' });

        res.json({
            success: true,
            data: {
                patients: totalPatients,
                doctors: totalDoctors,
                appointments: totalAppointments,
                specialties: totalSpecialties
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
