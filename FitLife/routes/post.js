const express = require('express');
const router = express.Router();
const postController  = require("../controllers/post");

router.get('/create', (req, res) => {
    res.render('layouts/main', {
        pageTitle: 'Create Post',
        pageBody: '../post/create',
        data: {
            message: null
        }
    })
})

router.post('/create', async (req, res) => {
    const email = req.session.email
    const post = {
        title: req.body.title,
        content: req.body.content,
        email: email
    }
    
    const newPost = await postController.createPost(post)
    res.render('layouts/main', {
        pageTitle: 'Create Post',
        pageBody: '../post/create', 
        data: {
            message: 'created'
        },
    });
})

router.get('/edit/:postId', async(req, res) => {
    const post = await postController.getPost(req.params.postId)
    let message = null
    if (typeof req.query.message !== 'undefined' && req.query.message !== null){
        message = req.query.message
    } 
    res.render('layouts/main', {
        pageTitle: 'Edit Post',
        pageBody: `../post/edit/`,
        data: {
            post: post,
            message: message
        }
    })
})

router.post('/edit', async (req, res) => {
    const email = req.session.email
    const post = {
        _id: req.body._id,
        title: req.body.title,
        content: req.body.content,
        email: email
    }
    
    const newPost = await postController.editPost(post)
    if(typeof req.body.groupId !== 'undefined'){
        res.redirect(`/group/show/${req.body.groupId}`)
    }
    else{
        res.redirect('/me/feed')
    }
    // res.redirect(`/post/edit/${newPost._id}?message=edited`)
})

router.get('/addLike/:postId', async (req, res) => {
    const email = req.session.email
    const newPost = postController.addLike(req.params.postId, email)
    if(typeof req.query.groupId !== 'undefined'){
        res.redirect(`/group/show/${req.query.groupId}`)
    }
    else{
        res.redirect('/me/feed')
    }
})

router.get('/removeLike/:postId', async (req, res) => {
    const email = req.session.email
    const newPost = postController.removeLike(req.params.postId, email)
    if(typeof req.query.groupId !== 'undefined'){
        res.redirect(`/group/show/${req.query.groupId}`)
    }
    else{
        res.redirect('/me/feed')
    }
})

router.post('/addComment/:postId', async (req, res) => {
    const email = req.session.email
    const comment = req.body.comment
    const newPost = postController.addComment(req.params.postId, email, comment)
    if(typeof req.body.groupId !== 'undefined'){
        res.redirect(`/group/show/${req.body.groupId}`)
    }
    else{
        res.redirect('/me/feed')
    }
})


module.exports = router