var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { 
        title: 'Index',
        active_index: true
    });
});

module.exports = router;
