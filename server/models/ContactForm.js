const mongoose = require('mongoose');

const contactFormSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add your name']
    },
    email: {
        type: String,
        required: [true, 'Please add your email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        default: ''
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject']
    },
    message: {
        type: String,
        required: [true, 'Please add a message'],
        maxlength: 1000
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'closed'],
        default: 'new'
    },
    reply: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

contactFormSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactForm', contactFormSchema);
