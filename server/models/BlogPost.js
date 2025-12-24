const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: 200
    },
    slug: {
        type: String,
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    excerpt: {
        type: String,
        maxlength: 500
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Maladies', 'Style de vie', 'Santé Mentale', 'Nutrition', 'Sport', 'Autres']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    tags: [{
        type: String
    }],
    isPublished: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Create slug from title before saving
blogPostSchema.pre('save', async function (next) {
    if (this.isModified('title') && !this.slug) {
        let slug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .substring(0, 50);

        // If slug is empty (e.g., Arabic characters), generate from timestamp
        if (!slug || slug.trim() === '') {
            slug = `post-${Date.now()}`;
        }

        // Ensure slug is unique
        let uniqueSlug = slug;
        let counter = 1;
        const BlogPost = this.constructor;
        while (await BlogPost.findOne({ slug: uniqueSlug, _id: { $ne: this._id } })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
        }

        this.slug = uniqueSlug;
    }
    next();
});


blogPostSchema.index({ category: 1, isPublished: 1 });

module.exports = mongoose.model('BlogPost', blogPostSchema);
