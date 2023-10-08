const express = require('express');
const router = express.Router();
const searchController = require("../controllers/search")

router.get('/search', async (req, res) => {    
    const data = {}
    res.render('layouts/main', {
        pageTitle: 'Search',
        pageBody: '../search/search', 
        data: data,
    });
});

router.post('/search/', async (req, res) => {    
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
        results: results
    }

    res.render('layouts/main', {
        pageTitle: 'Search',
        pageBody: '../search/search', 
        data: data,
    });
});


module.exports = router;