const express = require('express');
const router = express.Router();

router.get('/:groupId/feed', (req, res) => {
    const groupId = req.params.groupId;
    res.send('group ' + groupId + ' feed');
});

router.get('/group/:groupId/profile', (req, res) => {
    const groupId = req.params.groupId;
    res.send('group ' + groupId + ' profile');
});



module.exports = router;