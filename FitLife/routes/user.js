const express = require('express');
const router = express.Router();
const userController  = require("../controllers/user");


router.get('/settings', async (req, res) => {
    const email = req.session.email
    let message = null
    if(typeof req.query.message !== 'undefined'){
        message = req.query.message
    }
    
    const user = await userController.getUser(email)
    const data = 
    res.render('layouts/main', {
        pageTitle: 'Settings',
        pageBody: '../user/settings', 
        data: {
            user: user,
            message: message
        },
    });
});

router.post('/settings', async (req, res) => {
    const email = req.session.email
    let new_user = await userController.getUser(email)
    new_user.fname = req.body.fname
    new_user.lname = req.body.lname
    new_user.password = req.body.password
    new_user.date_of_birth = req.body.date_of_birth
    new_user.type = req.body.type
    const user = await userController.updateUser(new_user)
    if(user){
        res.redirect('/me/settings?message=1')
    }
    else {
        res.redirect('/me/settings?message=2')
    }
});

router.get('/feed',  async (req, res) => {
    const email = req.session.email
    const feed = await userController.feed(email)
    const user = await userController.getUser(req.session.email)
    let message = ''
    if(typeof req.query.message !== 'undefined'){
        message = req.query.message
    }
    res.render('layouts/main', {
        pageTitle: 'Feed',
        pageBody: '../user/feed',
        data: {
            feed: feed,
            user: user,
            message: message
        }
    });
});

router.get('/followings',  async (req, res) => {
    const email = req.session.email
    let message = null
    if(typeof req.query.message !== 'undefined'){
        message = req.query.message
    }
    const followings = await userController.followings(email)
    const user = await userController.getUser(req.session.email)
    res.render('layouts/main', {
        pageTitle: 'following',
        pageBody: '../user/friends', 
        data: {
            users: followings,
            followers: false,
            following: true,
            message: message,
            user: user
        }
    });
});

router.get('/followers',  async (req, res) => {
    const email = req.session.email
    const followers = await userController.followers(email)
    const user = await userController.getUser(req.session.email)
    res.render('layouts/main', {
        pageTitle: 'Feed',
        pageBody: '../user/friends', 
        data: {
            users: followers,
            followers: true,
            following: false,
            user: user
        }
    });
});

router.get('/unfollow/:email',  async (req, res) => {
    const email = req.session.email
    const unfollowEmail = req.params.email 
    const unfollow = await userController.unfollow(email, unfollowEmail)
    res.redirect("/me/followings?message=removed")
});

router.get('/follow/:email',  async (req, res) => {
    const email = req.session.email
    const followEmail = req.params.email 
    const follow = await userController.follow(email, followEmail)
    res.redirect("/me/followings?message=added")
});

router.get('/profile/:email', async (req, res) => {
    const email = req.session.email
    const user = await userController.getUser(req.params.email)
    const posts = await userController.userFeed(req.params.email)
    res.render('layouts/main', {
        pageTitle: 'Profile',
        pageBody: '../user/profile', 
        data: {
            user: user,
            posts: posts,
            isMe: false
        }
    });
});

router.get('/profile', async (req, res) => {
    const email = req.session.email
    const user = await userController.getUser(email)
    const posts = await userController.userFeed(email)
    res.render('layouts/main', {
        pageTitle: 'Profile',
        pageBody: '../user/profile', 
        data: {
            user: user,
            posts: posts,
            isMe: true
        }
    });
});



module.exports = router;