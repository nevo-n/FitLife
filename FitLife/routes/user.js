const express = require('express');
const router = express.Router();
const userController  = require("../controllers/user");

router.get('/', (req, res) => {
    console.log("Defualt me")
    res.redirect('/me/feed')
});

router.get('/settings', async (req, res) => {
    const email = req.session.email
    let message = null
    if(typeof req.query.message !== 'undefined'){
        message = req.query.message
    }
    
    const user = await userController.getUser(email)
    const data = {
        user: user,
        message: message
    }
    res.render('layouts/main', {
        pageTitle: 'Settings',
        pageBody: '../user/settings', 
        data: data,
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
    console.log(`creating feed for email: ${email}`)
    const data = await userController.feed(email)
    console.log(data)
    res.render('layouts/main', {
        pageTitle: 'Feed',
        pageBody: '../user/feed',
        data: data
    });
});

router.get('/followings',  async (req, res) => {
    const email = req.session.email
    console.log(`list followings for email: ${email}`)
    const followings = await userController.followings(email)
    const data = {
        users: followings,
        followers: false,
        following: true
    };
    console.log(data)
    res.render('layouts/main', {
        pageTitle: 'following',
        pageBody: '../user/friends', 
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
        pageBody: '../user/friends', 
        data: data
    });
});

router.get('/unfollow/:email',  async (req, res) => {
    const email = req.session.email
    const unfollowEmail = req.params.email 
    console.log(`unfollow for: ${email} the user ${unfollowEmail}`)
    const unfollow = await userController.unfollow(email, unfollowEmail)
    res.redirect("/me/followings")
});
module.exports = router;