const mongoose = require('mongoose');
const { Schema } = mongoose;

const messageSchema = new Schema({
    created_on: {
        type: Date,
        default: Date.now
    },
    sent_by: {
        type: Schema.Types.ObjectId,
        //ref: 'User',  // will be user id ref
    },
    content: {
        type: String,
        required: true,
        maxlength: 255
    }
});

const chatSchema = new Schema({
    created_on: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        required: true
    },
    group_id: {
        type: Schema.Types.ObjectId,
        //ref: 'Group',  // will be user id ref
    },
    messages: [messageSchema]
});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;
