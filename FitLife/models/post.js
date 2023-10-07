const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    created_on: { type: Date, default: Date.now },
    content: String
});

const postSchema = new Schema({
    created_on: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    content: String,
    title: { type: String, maxlength: 128 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    status: { type: String, default: 'enabled' }
});

module.exports = mongoose.model('Post', postSchema);