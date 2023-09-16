const mongoose = require("mongoose");

const Post = new mongoose.Schema({
    _id: String,
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        maxLength: 255
    },
    username: String,
    likes: { type : Array , "default" : [] },
    comments: { type : Array , "default" : [] }
}, { timestamps: true });

module.exports = mongoose.model("Post", Post);
