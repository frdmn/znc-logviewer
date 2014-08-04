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
    var filenameElements = filename.split("_");
    networkArray.push(filenameElements[0]);

    // Remove non-channels (queries) from channel list
    var channelPattern = new RegExp(/^#.*$/);
    var channelMatches = filenameElements[1].match(channelPattern);
    if (channelMatches) {
        channelArray.push(channelMatches[0]);
    };

    dateArray.push(filenameElements[2]);
});

// Make arrays unique
networkArray = uniquify(networkArray);
channelArray = uniquify(channelArray);
dateArray = uniquify(dateArray);

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
        active_index: true
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