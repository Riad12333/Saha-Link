const User = require('../models/User');
const Doctor = require('../models/Doctor');
const MedicalRecord = require('../models/MedicalRecord');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone, specialty, city } = req.body;

        console.log('Registration attempt:', { name, email, role, phone, specialty, city });

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'patient',
            phone
        });

        console.log('User created:', user._id, user.role);

        // Create associated profile based on role
        if (role === 'doctor') {
            const doctorProfile = await Doctor.create({
                user: user._id,
                specialty: specialty || 'general',
                city: city || '',
                isApproved: false
            });
            console.log('Doctor profile created:', doctorProfile._id);
        } else if (role === 'patient' || !role) {
            const medicalRecord = await MedicalRecord.create({
                patient: user._id
            });
            console.log('Medical record created:', medicalRecord._id);
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            // Check if user is active
            if (user.isActive === false) {
                return res.status(403).json({ message: 'Your account has been deactivated. Please contact admin.' });
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        let profileData = {};

        if (user.role === 'doctor') {
            const doctor = await Doctor.findOne({ user: user._id });
            if (doctor) profileData = { doctorProfile: doctor };
        } else if (user.role === 'patient') {
            const medicalRecord = await MedicalRecord.findOne({ patient: user._id });
            if (medicalRecord) profileData = { medicalRecord };
        }

        res.json({ ...user.toObject(), ...profileData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({ message: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
