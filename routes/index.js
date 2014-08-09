var express = require('express'),
    fs = require('fs');
var router = express.Router();

// Load settings file
var settings = require('../settings.json');
    
/* Parse informations from log file names */

// Set a temporary test user, to read logs from
var testuser = "frdmn";

// Init element array
var channelArray = [],
    dateArray = [];

var files = fs.readdirSync(settings.zncpath + '/users/' + testuser + '/moddata/log/');

files.forEach(function(filename){
    // Split filenames based on a pattern like <network>_<channel>_<date>
    var splitRegex = /^([a-z]*)_(.*)_([0-9]*).log$/g,
        splitMatch = splitRegex.exec(filename);

    // If we have a match, proceed to add to arrays
    if (splitMatch) {
        // Remove non-channels (queries) from channel list
        var channelMatches = splitMatch[2].match(/^#.*$/);
        if (channelMatches) {
            channelArray.push(channelMatches[0]);
        }

        // Turn into correct format for datepicker
        var dateRegex = /^([0-9]{4})([0-9]{2})([0-9]{2})$/g,
            dateMatch = dateRegex.exec(splitMatch[3]);
        if (dateMatch) {
            var newDate = dateMatch[1] + '-' + dateMatch[2] + '-' + dateMatch[3];
            dateArray.push(newDate);
        }
    } 
});

// Make arrays unique
channelArray = uniquify(channelArray);
dateArray = uniquify(dateArray);

// Create object which gets passed to the template
arrayObject = {};
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