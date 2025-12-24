const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    siteName: {
        type: String,
        default: 'SahaLink'
    },
    siteEmail: {
        type: String,
        default: 'contact@sahalink.com'
    },
    sitePhone: {
        type: String,
        default: '+213 XXX XXX XXX'
    },
    enableRegistration: {
        type: Boolean,
        default: true
    },
    requireEmailVerification: {
        type: Boolean,
        default: false
    },
    enableNotifications: {
        type: Boolean,
        default: true
    },
    emailNotifications: {
        type: Boolean,
        default: true
    },
    smsNotifications: {
        type: Boolean,
        default: false
    },
    maintenanceMode: {
        type: Boolean,
        default: false
    },
    maxAppointmentsPerDay: {
        type: Number,
        default: 10
    },
    appointmentDuration: {
        type: Number,
        default: 30
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);
