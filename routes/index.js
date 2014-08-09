var express = require('express'),
    fs = require('fs');
var router = express.Router();

// Load settings file
var settings = require('../settings.json');
    

// Make arrays unique
channelArray = uniquify(channelArray);
dateArray = uniquify(dateArray);

// Create object which gets passed to the template
arrayObject = {};
arrayObject.network = settings.network;
arrayObject.user = settings.user;
arrayObject.channelArray = channelArray;
arrayObject.dateArray = dateArray;

// Display found elements
console.log('Found ' + channelArray.length + ' channels and ' + dateArray.length + ' possible dates');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', { 
        title: 'Index',
        active_index: true,
        arrayObject: arrayObject
    });
});

// Function to remove duplicate elements from array
function uniquify(array){
    array = array.filter(function(elem, pos) {
        return array.indexOf(elem) == pos;
    });
    return(array);
}

module.exports = router;