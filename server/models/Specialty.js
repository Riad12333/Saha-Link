const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add specialty name'],
        unique: true
    },
    icon: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: '#0066cc'
    },
    description: {
        type: String,
        default: ''
    },
    doctorCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});



module.exports = mongoose.model('Specialty', specialtySchema);
