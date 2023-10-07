const express = require('express');
const router = express.Router();
const userController  = require("../controllers/user");

router.get('/', (req, res) => {
    console.log("Defualt me")
    res.redirect('/me/feed')
});

router.get('/settings', (req, res) => {
    console.log("User Settings Page")
    res.send('User Settings Page');
});

router.get('/feed',  async (req, res) => {
    const email = req.session.email
    console.log(`creating feed for email: ${email}`)
    const data = await userController.feed(email)
    console.log(data)
    res.render('layouts/main', {
        pageTitle: 'Feed',
        pageBody: '../user/feed', // The EJS view filename you want to render as the body
        data: data
    });
});

router.get('/followings',  async (req, res) => {
    const email = req.session.email
    console.log(`list followings for email: ${email}`)
    const followings = await userController.followings(email)
    const data = {
        users: followings,
        followers: true,
        following: false
    };
    console.log(data)
    res.render('layouts/main', {
        pageTitle: 'following',
        pageBody: '../user/friends', // The EJS view filename you want to render as the body
        data: data
    });
});

router.get('/followers',  async (req, res) => {
    const email = req.session.email
    console.log(`list followers for email: ${email}`)
    const followers = await userController.followers(email)
    const data = {
        users: followers,
        followers: true,
        following: false
    };
    console.log(data)
    res.render('layouts/main', {
        pageTitle: 'Feed',
        pageBody: '../user/friends', // The EJS view filename you want to render as the body
        data: data
    });
});

module.exports = router;