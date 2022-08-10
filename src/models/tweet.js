const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId }],
    likeCount: {
        type: Number,
        default: 0,
        min: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('tweet', tweetSchema);