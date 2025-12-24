const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    specialty: {
        type: String,
        required: [true, 'Please add a specialty']
    },
    city: {
        type: String,
        default: ''
    },
    experience: {
        type: Number,
        default: 0
    },
    clinicAddress: {
        type: String,
        default: ''
    },
    languages: [{
        type: String
    }],
    bio: {
        type: String,
        maxlength: 500
    },
    diplomas: [{
        type: String // Cloudinary URLs
    }],
    isApproved: {
        type: Boolean,
        default: false
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    },
    consultationFees: {
        online: {
            type: Number,
            default: 0
        },
        inPerson: {
            type: Number,
            default: 0
        }
    },
    availability: [{
        day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        },
        slots: [{
            start: String, // "09:00"
            end: String,   // "10:00"
            maxPatients: {
                type: Number,
                default: 1
            }
        }]
    }]
}, {
    timestamps: true
});

// Create compound index for queries
doctorSchema.index({ specialty: 1, city: 1, isApproved: 1 });


module.exports = mongoose.model('Doctor', doctorSchema);
