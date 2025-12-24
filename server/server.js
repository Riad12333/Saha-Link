const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'SahaLink API is running...',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            doctors: '/api/doctors',
            patients: '/api/patients',
            appointments: '/api/appointments',
            admin: '/api/admin',
            blog: '/api/blog',
            specialties: '/api/specialties',
            contact: '/api/contact'
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/contentRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/testimonials', require('./routes/testimonialRoutes'));

// Error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    console.error('Error stack:', err.stack);

    // Don't send response if headers already sent
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Erreur serveur'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route non trouvée'
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 API: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/health`);
});
