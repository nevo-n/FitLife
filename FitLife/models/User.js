const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    created_on: { type: Date, default: Date.now },
    fname: String,
    lname: String,
    email: String,
    password: String,
    date_of_birth: Date,
    type: String,
    status: String,
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    groups: [{type: Schema.Types.ObjectId, ref: 'Group'}],
});

module.exports = mongoose.model('User', userSchema);