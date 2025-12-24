const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const ContactForm = require('../models/ContactForm');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
    try {
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await Doctor.countDocuments();
        const approvedDoctors = await Doctor.countDocuments({ isApproved: true });
        const pendingDoctors = await Doctor.countDocuments({ isApproved: false });
        const totalAppointments = await Appointment.countDocuments();
        const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        const unreadMessages = await ContactForm.countDocuments({ status: 'new' });

        // Calculate global satisfaction rate
        const doctors = await Doctor.find({ isApproved: true });
        const totalRating = doctors.reduce((acc, doc) => acc + (doc.averageRating || 0), 0);
        const satisfactionRate = doctors.length > 0 ? (totalRating / doctors.length).toFixed(1) : 0;

        // Revenue (if payment implemented)
        const revenue = await Appointment.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);

        // Real Revenue by month (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const realRevenueByMonth = await Appointment.aggregate([
            {
                $match: {
                    date: { $gte: sixMonthsAgo },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" }
                    },
                    revenue: { $sum: "$price" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

        // Map data or provide zeros if no data for a month
        const revenueByMonth = monthNames.map((name, index) => {
            const found = realRevenueByMonth.find(r => r._id.month === (index + 1));
            return {
                month: name,
                revenue: found ? found.revenue : 0
            };
        }).filter((_, index) => {
            // Keep only latest 6 months
            const currentMonth = new Date().getMonth();
            return index > currentMonth - 6 && index <= currentMonth;
        });

        // Consultation types distribution
        const onlineCount = await Appointment.countDocuments({ type: 'online' });
        const inPersonCount = await Appointment.countDocuments({ type: 'in-person' });

        const consultationTypes = [
            { name: 'En ligne', value: onlineCount },
            { name: 'En clinique', value: inPersonCount }
        ];

        res.json({
            success: true,
            data: {
                totalPatients,
                totalDoctors,
                approvedDoctors,
                pendingDoctors,
                totalAppointments,
                completedAppointments,
                pendingAppointments,
                unreadMessages,
                satisfactionRate,
                totalRevenue: revenue[0]?.total || 0,
                revenueByMonth: revenueByMonth.length > 0 ? revenueByMonth : monthNames.slice(0, 6).map(m => ({ month: m, revenue: 0 })),
                consultationTypes
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all users (patients and doctors)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let query = {};

        if (role) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .limit(parseInt(limit))
            .skip(skip)
            .sort('-createdAt');

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            count: users.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create user (admin)
// @route   POST /api/admin/users
// @access  Private (Admin only)
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            isVerified: true,
            isActive: true
        });

        res.status(201).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
exports.updateUser = async (req, res) => {
    try {
        const { name, email, role, phone, isActive } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, phone, isActive },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Toggle user status (activate/deactivate)
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
exports.toggleUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({ success: true, data: user, message: `User ${user.isActive ? 'activated' : 'deactivated'}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all doctors (admin)
// @route   GET /api/admin/doctors
// @access  Private (Admin only)
exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({})
            .populate('user', 'name email phone avatar createdAt isActive')
            .sort('-createdAt');

        res.json({ success: true, count: doctors.length, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get pending doctors
// @route   GET /api/admin/doctors/pending
// @access  Private (Admin only)
exports.getPendingDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find({ isApproved: false })
            .populate('user', 'name email phone avatar createdAt')
            .sort('-createdAt');

        res.json({ success: true, count: doctors.length, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Approve doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private (Admin only)
exports.approveDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).populate('user', 'name email');

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If doctor, delete doctor profile too
        if (user.role === 'doctor') {
            await Doctor.findOneAndDelete({ user: req.params.id });
        }

        await user.deleteOne();

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all contact forms
// @route   GET /api/admin/contacts
// @access  Private (Admin only)
exports.getContactForms = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (status) {
            query.status = status;
        }

        const contacts = await ContactForm.find(query)
            .limit(parseInt(limit))
            .skip(skip)
            .sort('-createdAt');

        const total = await ContactForm.countDocuments(query);

        res.json({
            success: true,
            count: contacts.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: contacts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
const Settings = require('../models/Settings');

// @desc    Get site settings
// @route   GET /api/admin/settings
// @access  Private (Admin only)
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create({});
        }

        res.json({ success: true, data: settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update site settings
// @route   PUT /api/admin/settings
// @access  Private (Admin only)
exports.updateSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            settings = await Settings.create(req.body);
        } else {
            settings = await Settings.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
        }

        res.json({ success: true, data: settings, message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
