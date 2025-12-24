const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Review = require('../models/Review');
const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');

// @desc    Get all doctors with filters
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
    try {
        const { specialty, city, available, page = 1, limit = 12, search } = req.query;

        // Build query
        let query = { isApproved: true };

        if (specialty) {
            query.specialty = specialty;
        }

        if (city) {
            query.city = city;
        }

        if (search) {
            const matchingUsers = await User.find({
                name: { $regex: search, $options: 'i' },
                role: 'doctor'
            }).select('_id');

            const userIds = matchingUsers.map(u => u._id);

            query.$or = [
                { user: { $in: userIds } },
                { specialty: { $regex: search, $options: 'i' } },
                { city: { $regex: search, $options: 'i' } },
                { bio: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const skip = (page - 1) * limit;

        const doctorsCount = await Doctor.countDocuments(query);
        const doctors = await Doctor.find(query)
            .populate('user', 'name email phone avatar')
            .limit(parseInt(limit))
            .skip(skip)
            .sort('-averageRating');

        res.json({
            success: true,
            count: doctors.length,
            total: doctorsCount,
            page: parseInt(page),
            pages: Math.ceil(doctorsCount / limit),
            data: doctors
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)
            .populate('user', 'name email phone avatar');

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get doctor availability slots
// @route   GET /api/doctors/:id/slots
// @access  Public
exports.getDoctorSlots = async (req, res) => {
    try {
        const { date } = req.query;
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Get day of week from date
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

        // Find availability for that day
        const dayAvailability = doctor.availability.find(a => a.day === dayOfWeek);

        if (!dayAvailability) {
            return res.json({ success: true, data: [] });
        }

        // TODO: Check booked appointments and filter out unavailable slots
        res.json({ success: true, data: dayAvailability.slots });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get doctor reviews
// @route   GET /api/doctors/:id/reviews
// @access  Public
exports.getDoctorReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({ doctor: req.params.id })
            .populate('patient', 'name avatar')
            .limit(parseInt(limit))
            .skip(skip)
            .sort('-createdAt');

        const total = await Review.countDocuments({ doctor: req.params.id });

        res.json({
            success: true,
            count: reviews.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            data: reviews
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private (Doctor only)
exports.createDoctor = async (req, res) => {
    try {
        const { specialty, city, experience, clinicAddress, languages, bio, consultationFees } = req.body;

        // Check if doctor profile already exists
        const doctorExists = await Doctor.findOne({ user: req.user.id });

        if (doctorExists) {
            return res.status(400).json({ success: false, message: 'Doctor profile already exists' });
        }

        const doctor = await Doctor.create({
            user: req.user.id,
            specialty,
            city,
            experience,
            clinicAddress,
            languages,
            bio,
            consultationFees
        });

        res.status(201).json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private (Doctor only)
exports.updateDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Make sure user is doctor owner
        if (doctor.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'name email phone avatar');

        res.json({ success: true, data: updatedDoctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get patient medical record (Doctor view)
// @route   GET /api/doctors/patients/:patientId/medical-record
// @access  Private (Doctor only)
exports.getPatientMedicalRecord = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify doctor has appointment with patient or is authorized
        // For now, we allow doctors to view records of patients they have appointments with
        const hasAppointment = await Appointment.findOne({
            doctor: req.user.doctorId || (await Doctor.findOne({ user: req.user.id }))._id,
            patient: patientId
        });

        if (!hasAppointment && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized to view this patient record' });
        }

        let record = await MedicalRecord.findOne({ patient: patientId })
            .populate('patient', 'name email phone avatar');

        if (!record) {
            return res.status(404).json({ success: false, message: 'Medical record not found' });
        }

        res.json({ success: true, data: record });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add review for doctor
// @route   POST /api/doctors/:id/reviews
// @access  Private (Patient only)
exports.addReview = async (req, res) => {
    try {
        const { rating, comment, appointmentId } = req.body;

        // Check if doctor exists
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        // Create review
        const review = await Review.create({
            doctor: req.params.id,
            patient: req.user.id,
            appointment: appointmentId,
            rating,
            comment,
            isVerified: !!appointmentId
        });

        // Update doctor rating
        const reviews = await Review.find({ doctor: req.params.id });
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

        doctor.averageRating = avgRating;
        doctor.totalReviews = reviews.length;
        await doctor.save();

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get doctor dashboard stats
// @route   GET /api/doctors/dashboard
// @access  Private (Doctor)
exports.getDashboard = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user.id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Profil médecin non trouvé'
            });
        }

        // Get appointments
        const appointments = await Appointment.find({ doctor: doctor._id })
            .populate('patient', 'name email phone avatar')
            .sort('-date');

        // Calculate stats
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        // Filter for today using ranges which is safer
        const todayApps = appointments.filter(apt => {
            if (!apt.date) return false;
            const aptDate = new Date(apt.date);
            return aptDate >= startOfDay && aptDate <= endOfDay;
        });

        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Revenue: Include CONFIRMED and COMPLETED for demo purposes
        // Also relax specific payment check for now
        const revenueWeek = appointments
            .filter(apt =>
                (apt.status === 'completed' || apt.status === 'confirmed') &&
                new Date(apt.date) >= weekAgo
            )
            .reduce((sum, apt) => sum + (apt.price || 0), 0);

        const revenueMonth = appointments
            .filter(apt =>
                (apt.status === 'completed' || apt.status === 'confirmed') &&
                new Date(apt.date) >= monthAgo
            )
            .reduce((sum, apt) => sum + (apt.price || 0), 0);

        const uniquePatients = new Set(
            appointments.map(apt => apt.patient?._id?.toString() || apt.patient?.toString())
                .filter(Boolean)
        ).size;

        const activePatients = new Set(
            appointments
                .filter(apt => new Date(apt.date) >= monthAgo)
                .map(apt => apt.patient?._id?.toString() || apt.patient?.toString())
                .filter(Boolean)
        ).size;

        const stats = {
            appointmentsToday: todayApps.length,
            confirmedToday: todayApps.filter(apt => apt.status === 'confirmed').length,
            totalPatients: uniquePatients,
            activePatients: activePatients,
            pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
            completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
            pendingTeleconsultations: appointments.filter(apt =>
                apt.status === 'pending' && apt.type === 'online'
            ).length,
            revenueWeek: revenueWeek,
            revenueMonth: revenueMonth,
            rating: doctor.averageRating || 0,
            totalAppointments: appointments.length
        };

        // Find next confirmed or pending appointment
        const nextAppointment = appointments
            .filter(apt => new Date(apt.date) >= startOfDay && apt.status !== 'cancelled' && apt.status !== 'completed')
            .sort((a, b) => new Date(a.date) - new Date(b.date))[0] || null;

        res.json({
            success: true,
            data: {
                stats,
                appointments: appointments.slice(0, 5), // Return recent 5
                nextAppointment
            }
        });
    } catch (error) {
        console.error('Error in getDashboard:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get doctor's patients list
// @route   GET /api/doctors/patients
// @access  Private (Doctor)
exports.getPatients = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ user: req.user.id });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Profil médecin non trouvé'
            });
        }

        // Get all appointments for this doctor
        const appointments = await Appointment.find({ doctor: doctor._id })
            .populate('patient', 'name email phone avatar')
            .sort('-date');

        // Get unique patients
        const patientsMap = new Map();

        appointments.forEach(apt => {
            let patientId = null;
            let patientData = null;

            if (apt.patient) {
                if (apt.patient._id) {
                    patientId = apt.patient._id.toString();
                    patientData = apt.patient;
                } else {
                    patientId = apt.patient.toString();
                }
            }

            if (patientId && !patientsMap.has(patientId)) {
                // Find interactions
                const patientAppointments = appointments.filter(a =>
                    (a.patient?._id?.toString() || a.patient?.toString()) === patientId
                );

                const lastVisitApt = patientAppointments
                    .filter(a => a.status === 'completed')
                    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

                const recentApt = patientAppointments[0];

                const name = patientData?.name || 'Patient';
                const email = patientData?.email || '';
                const phone = patientData?.phone || '';
                const avatar = patientData?.avatar || '';

                patientsMap.set(patientId, {
                    _id: patientId,
                    name,
                    email,
                    phone,
                    avatar,
                    lastVisit: lastVisitApt ? lastVisitApt.date : (recentApt ? recentApt.date : null),
                    totalAppointments: patientAppointments.length,
                    status: 'active'
                });
            }
        });

        res.json({
            success: true,
            data: Array.from(patientsMap.values())
        });
    } catch (error) {
        console.error('Error in getPatients:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};