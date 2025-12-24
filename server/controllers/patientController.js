const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, avatar },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get patient appointments
// @route   GET /api/patients/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        let query = { patient: req.user.id };
        if (status) {
            query.status = status;
        }

        const appointments = await Appointment.find(query)
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email phone avatar' }
            })
            .limit(parseInt(limit))
            .skip(skip)
            .sort('-date');

        const total = await Appointment.countDocuments(query);

        res.json({
            success: true,
            count: appointments.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: appointments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get patient medical record
// @route   GET /api/patients/medical-record
// @access  Private
exports.getMedicalRecord = async (req, res) => {
    try {
        let record = await MedicalRecord.findOne({ patient: req.user.id });

        // Create if doesn't exist
        if (!record) {
            record = await MedicalRecord.create({ patient: req.user.id });
        }

        res.json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update patient medical record
// @route   PUT /api/patients/medical-record
// @access  Private
exports.updateMedicalRecord = async (req, res) => {
    try {
        let record = await MedicalRecord.findOne({ patient: req.user.id });

        if (!record) {
            record = await MedicalRecord.create({
                patient: req.user.id,
                ...req.body
            });
        } else {
            record = await MedicalRecord.findOneAndUpdate(
                { patient: req.user.id },
                req.body,
                { new: true, runValidators: true }
            );
        }

        res.json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get patient dashboard stats
// @route   GET /api/patients/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
    try {
        const patientId = req.user.id;

        // Get user and favorites
        const user = await User.findById(patientId).populate({
            path: 'favorites',
            populate: { path: 'user', select: 'name email phone avatar' }
        });

        // Get appointments
        const appointments = await Appointment.find({ patient: patientId })
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email phone avatar' }
            })
            .sort('-date');

        // Get medical record
        const medicalRecord = await MedicalRecord.findOne({ patient: patientId });

        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = {
            totalAppointments: appointments.length,
            upcomingAppointments: appointments.filter(apt =>
                new Date(apt.date) >= today && apt.status !== 'cancelled'
            ).length,
            completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
            pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
            lastConsultation: appointments
                .filter(apt => apt.status === 'completed')
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null,
            nextAppointment: appointments
                .filter(apt => new Date(apt.date) >= today && apt.status !== 'cancelled')
                .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null
        };

        // Get unique doctors
        const uniqueDoctors = new Map();
        appointments.forEach(apt => {
            if (apt.doctor && apt.doctor._id) {
                if (!uniqueDoctors.has(apt.doctor._id.toString())) {
                    uniqueDoctors.set(apt.doctor._id.toString(), apt.doctor);
                }
            }
        });

        res.json({
            success: true,
            data: {
                stats,
                appointments: appointments.slice(0, 5), // Last 5 for preview
                followedDoctors: Array.from(uniqueDoctors.values()).slice(0, 3),
                medicalRecord: medicalRecord || null,
                favorites: user?.favorites || []
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};