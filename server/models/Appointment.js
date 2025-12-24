const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Please add appointment date']
    },
    slot: {
        start: String, // "09:00"
        end: String    // "10:00"
    },
    type: {
        type: String,
        enum: ['online', 'in-person'],
        default: 'online'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },
    reason: {
        type: String,
        required: [true, 'Please add reason for appointment']
    },
    notes: {
        type: String,
        default: ''
    },
    prescription: {
        type: String, // URL to prescription document
        default: ''
    },
    videoLink: {
        type: String, // Zoom/Jitsi link
        default: ''
    },
    price: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// Create indexes for efficient queries
appointmentSchema.index({ doctor: 1, date: 1, status: 1 });
appointmentSchema.index({ patient: 1, status: 1 });
appointmentSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
