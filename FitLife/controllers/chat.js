const Chat = require('../models/chat');
const mongoose = require('mongoose');


exports.getMessages = (chatId) => {
   // TODO: replace with fetching messages from the model
    return {
        message: `Messages for chatId ${chatId}.`,
        additionalInfo: "More data can be added here."
    };
};


