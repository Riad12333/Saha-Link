const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
    try {
        // Check if user exists
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Non autorisé, utilisateur non trouvé'
            });
        }

        let query;

        // If user is patient, show only their appointments
        if (req.user.role === 'patient') {
            query = { patient: req.user.id };
        }
        // If user is doctor, show appointments for their doctor profile
        else if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: req.user.id });
            if (!doctor) {
                return res.status(404).json({
                    success: false,
                    message: 'Profil médecin non trouvé'
                });
            }
            query = { doctor: doctor._id };
        }
        // Admin can see all
        else {
            query = {};
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'name email phone avatar')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email phone avatar' }
            })
            .sort('-createdAt');

        res.json({
            success: true,
            data: appointments
        });
    } catch (error) {
        console.error('Error in getAppointments:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la récupération des rendez-vous'
        });
    }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'name email phone avatar')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email phone avatar' }
            });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Rendez-vous non trouvé'
            });
        }

        // Authorization check: only patient or doctor of the appointment can see it
        // Handle cases where populate might have failed or field names are different
        const patientId = appointment.patient?._id || appointment.patient;
        const doctorUserId = appointment.doctor?.user?._id || appointment.doctor?.user;

        const isPatient = patientId?.toString() === req.user.id;
        const isDoctor = doctorUserId?.toString() === req.user.id;

        if (!isPatient && !isDoctor && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Non autorisé à accéder à ce rendez-vous'
            });
        }

        res.json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private (Patient)
exports.createAppointment = async (req, res) => {
    try {
        // Check if user exists
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Non autorisé, utilisateur non trouvé'
            });
        }

        // Check if user is a patient
        if (req.user.role !== 'patient') {
            return res.status(403).json({
                success: false,
                message: 'Seuls les patients peuvent créer des rendez-vous'
            });
        }

        const { doctor, date, time, reason, notes, type } = req.body;

        // Validate required fields
        if (!doctor || !date || !time || !reason) {
            return res.status(400).json({
                success: false,
                message: 'Veuillez fournir tous les champs requis (doctor, date, time, reason)'
            });
        }

        // Get doctor to retrieve consultation fees
        const doctorProfile = await Doctor.findById(doctor);
        if (!doctorProfile) {
            return res.status(404).json({
                success: false,
                message: 'Médecin non trouvé'
            });
        }

        // Calculate price based on appointment type
        const appointmentType = type || 'online';
        const price = appointmentType === 'online'
            ? doctorProfile.consultationFees?.online || 0
            : doctorProfile.consultationFees?.inPerson || 0;

        // Convert time string to slot object
        if (!time || !time.includes(':')) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'heure invalide. Utilisez HH:MM (ex: 09:00)'
            });
        }

        const [hours, minutes] = time.split(':');
        if (!hours || !minutes || isNaN(parseInt(hours)) || isNaN(parseInt(minutes))) {
            return res.status(400).json({
                success: false,
                message: 'Format d\'heure invalide. Utilisez HH:MM (ex: 09:00)'
            });
        }

        const startTime = `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
        const endHours = parseInt(hours) + 1;
        const endTime = `${endHours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;

        // Validate date is not in the past
        const appointmentDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        appointmentDate.setHours(0, 0, 0, 0);

        if (appointmentDate < today) {
            return res.status(400).json({
                success: false,
                message: 'La date du rendez-vous ne peut pas être dans le passé'
            });
        }

        // Validate doctor ID format (MongoDB ObjectId)
        if (!doctor.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: 'ID du médecin invalide'
            });
        }

        // Create appointment
        let appointment;
        try {
            appointment = await Appointment.create({
                patient: req.user.id,
                doctor,
                date: new Date(date),
                slot: {
                    start: startTime,
                    end: endTime
                },
                type: appointmentType,
                reason,
                notes: notes || '',
                price
            });
        } catch (createError) {
            console.error('Error creating appointment in DB:', createError);
            return res.status(400).json({
                success: false,
                message: createError.message || 'Erreur lors de la création du rendez-vous dans la base de données'
            });
        }

        // Populate and return
        let populatedAppointment;
        try {
            populatedAppointment = await Appointment.findById(appointment._id)
                .populate('patient', 'name email phone avatar')
                .populate({
                    path: 'doctor',
                    populate: { path: 'user', select: 'name email phone avatar' }
                });

            if (!populatedAppointment) {
                return res.status(500).json({
                    success: false,
                    message: 'Erreur lors de la récupération du rendez-vous créé'
                });
            }
        } catch (populateError) {
            console.error('Error populating appointment:', populateError);
            // Return the appointment even if populate fails
            return res.status(201).json({
                success: true,
                data: appointment
            });
        }

        res.status(201).json({
            success: true,
            data: populatedAppointment
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message).join(', ');
            return res.status(400).json({
                success: false,
                message: `Erreur de validation: ${messages}`
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Un rendez-vous existe déjà pour ce créneau'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la création du rendez-vous'
        });
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Rendez-vous non trouvé'
            });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('patient', 'name email phone avatar')
            .populate({
                path: 'doctor',
                populate: { path: 'user', select: 'name email phone avatar' }
            });

        res.json({
            success: true,
            data: updatedAppointment
        });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la mise à jour du rendez-vous'
        });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Rendez-vous non trouvé'
            });
        }

        await appointment.deleteOne();
        res.json({
            success: true,
            message: 'Rendez-vous supprimé avec succès'
        });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Erreur lors de la suppression du rendez-vous'
        });
    }
};
