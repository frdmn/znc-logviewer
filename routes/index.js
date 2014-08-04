var express = require('express'),
    fs = require('fs');
var router = express.Router();

// Load settings file
var settings = require('../settings.json');
    
/* Parse informations from log file names */

// Set a temporary test user, to read logs from
var testuser = "frdmn";

// Init element array
var networkArray = [],
    channelArray = [],
    dateArray = [];

var files = fs.readdirSync(settings.zncpath + '/users/' + testuser + '/moddata/log/');

files.forEach(function(filename){
    // Split filenames based on a pattern like <network>_<channel>_<date>
    var splitRegex = /^([a-z]*)_(.*)_([0-9]*).log$/g,
        splitMatch = splitRegex.exec(filename);

    // If we have a match, proceed to add to arrays
    if (splitMatch) {
        networkArray.push(splitMatch[1]);

        // Remove non-channels (queries) from channel list
        var channelMatches = splitMatch[2].match(/^#.*$/);
        if (channelMatches) {
            channelArray.push(channelMatches[0]);
        };

        dateArray.push(splitMatch[3]);
    } 
});

// Make arrays unique
networkArray = uniquify(networkArray);
channelArray = uniquify(channelArray);
dateArray = uniquify(dateArray);

// Create object which gets passed to the template
arrayObject = {};
arrayObject.networkArray = networkArray;
arrayObject.channelArray = channelArray;
arrayObject.dateArray = dateArray;

// Remove "znc" element from networkArray, to exclude ZNC status logs
var networkIndex = networkArray.indexOf('znc');
if(networkIndex!=-1){
   networkArray.splice(networkIndex, 1);
}

// Display found elements
console.log('Found ' + networkArray.length + ' networks, ' + channelArray.length + ' channels and ' + dateArray.length + ' possible dates');

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