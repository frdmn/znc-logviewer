var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('about', { 
        title: 'About',
        active_about: true
    });
});

module.exports = router;
