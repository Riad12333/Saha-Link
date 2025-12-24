const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Please add a comment'],
        maxlength: 500
    },
    isVerified: {
        type: Boolean,
        default: false // Only patients who had appointments can review
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews for same appointment
reviewSchema.index({ patient: 1, doctor: 1, appointment: 1 }, { unique: true });
reviewSchema.index({ doctor: 1 });

module.exports = mongoose.model('Review', reviewSchema);
