const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: [true, 'Please add content'],
        maxlength: 500
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating'],
        min: 1,
        max: 5
    },
    showOnHomepage: {
        type: Boolean,
        default: true // Auto-publish for simplicity, or false if moderation needed
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
