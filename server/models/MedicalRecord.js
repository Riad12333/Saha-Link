const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''],
        default: ''
    },
    allergies: [{
        type: String
    }],
    chronicDiseases: [{
        type: String
    }],
    currentMedications: [{
        type: String
    }],
    surgeries: [{
        type: String
    }],
    familyHistory: [{
        type: String
    }],
    vaccinations: [{
        type: String
    }],
    height: {
        type: Number,
        default: 0
    },
    weight: {
        type: Number,
        default: 0
    },
    emergencyContact: {
        name: {
            type: String,
            default: ''
        },
        phone: {
            type: String,
            default: ''
        },
        relation: {
            type: String,
            default: ''
        }
    },
    documents: [{
        title: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        },
        doctorName: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            enum: ['Analyse', 'Imagerie', 'Ordonnance', 'Autre'],
            default: 'Autre'
        },
        fileUrl: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
