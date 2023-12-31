const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group');
const userController = require('../controllers/user')


router.get('/create', async (req, res) => {
    const user = await userController.getUser(req.session.email)
    res.render('layouts/main', {
        pageTitle: 'Create Post',
        pageBody: '../group/create', 
        data: {
            message: 'created',
            user: user
        },
    });
})

router.post('/create', async (req, res) => {
    const email = req.session.email
    const tags = req.body.tags.split("#")
                 .map(tag => tag.trim())
                 .filter(tag => tag !== '');
    const groupDetails = {
        name: req.body.name,
        description: req.body.description,
        tags: tags
    }
    const newGroup = await groupController.createGroup(email, groupDetails)
    res.redirect(`/group/show/${newGroup._id}?message=created`)
})

router.get('/show/:groupId', async (req, res) => {
    const user = await userController.getUser(req.session.email)
    const group = await groupController.getGroup(req.params.groupId, user._id)
    let message = ''
    if(typeof req.query.message !== 'undefined'){
        message = req.query.message
    }
    res.render('layouts/main', {
        pageTitle: 'Create Post',
        pageBody: '../group/show', 
        data: {
            group: group,
            message: message,
            user: user
        },
    });
})

router.post('/post/create', async (req, res) => {
    const postDetails = {
        email: req.session.email,
        title: req.body.title,
        content: req.body.content,
        comment: [],
        likes: []
    }
    const post = await groupController.createPost(postDetails, req.body.groupId)
    res.redirect(`/group/show/${req.body.groupId}`)
})


router.post('/edit', async (req, res) => {
    const tags = req.body.tags.split("#")
                 .map(tag => tag.trim())
                 .filter(tag => tag !== '');
    const groupDetails = {
        groupId: req.body.groupId,
        name: req.body.name,
        description: req.body.description,
        tags: tags
    }
    const newGroup = await groupController.editGroup(groupDetails)
    res.redirect(`/group/show/${newGroup._id}?message=edited`)
})

router.get('/join/:groupId', async (req, res) => {
    const email = req.session.email
    const groupId = req.params.groupId
    const group = await groupController.joinGroup(groupId, email)
    res.redirect(`/group/show/${group._id}?message=joined`)
})

router.get('/leave/:groupId', async (req, res) => {
    const email = req.session.email
    const groupId = req.params.groupId
    const group = await groupController.leaveGroup(groupId, email)
    res.redirect(`/me/feed?message=leftGroup`)
})


module.exports = router;