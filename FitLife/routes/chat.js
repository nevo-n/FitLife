const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');

router.get('/:chatId/messages', (req, res) => {
    const chatId = req.params.chatId;
    const chatData = chatController.getMessages(chatId);
    
    res.render('layouts/main', {
        pageTitle: 'Chat messages',
        pageBody: '../chat/chat', // The EJS view filename you want to render as the body
        data: chatData
    });
});

router.get('/:chatId/create', (req, res) => {
    const chatId = req.params.chatId
    console.log("creating chat with id: " + chatId)
    chatController.createMockChat(chatId)
    res.render('layouts/main', {
        pageTitle: 'Chat messages',
        pageBody: '../chat/chat', 
        data: chatController.getMessages(chatId)
    });
});






module.exports = router;