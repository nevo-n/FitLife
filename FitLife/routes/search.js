const express = require('express');
const router = express.Router();
const searchController = require("../controllers/search")
const userController = require("../controllers/user")

router.get('/search', async (req, res) => {  
    const user = await userController.getUser(req.session.email)
  
    const data = {
        user: user
    }
    res.render('layouts/main', {
        pageTitle: 'Search',
        pageBody: '../search/search', 
        data: data,
    });
});

router.post('/search/', async (req, res) => {    
    const user = await userController.getUser(req.session.email)
    const type = req.body.type
    const text = req.body.text
    let results = null 
    if(type == "user"){
        results = await searchController.searchUser(text, req.session.email)
    }
    else if(type == "group"){
        results = await searchController.searchGroup(text)
    }
    data = {
        type: type,
        text: text,
        results: results,
        user: user
    }

    res.render('layouts/main', {
        pageTitle: 'Search',
        pageBody: '../search/search', 
        data: data,
    });
});


module.exports = router;