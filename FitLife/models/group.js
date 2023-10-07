const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
    created_on: { type: Date, default: Date.now },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    description: String,
    tags: [String],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

module.exports = mongoose.model('Group', groupSchema);