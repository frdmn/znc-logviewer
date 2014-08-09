var express = require('express'),
    fs = require('fs');
var router = express.Router();

// Load settings file
var settings = require('../settings.json');
    
/* GET home page. */
router.get('/', function(req, res) {
    /* Parse informations from log file names */

    // Init element array
    var channelArray = [];
    
    var files = fs.readdirSync(settings.zncpath + '/users/' + settings.user + '/moddata/log/');

    files.forEach(function(filename){
        // Split filenames based on a pattern like <network>_<channel>_<date>
        var splitPattern = '^' + settings.network + '_(.*)_[0-9]*.log$',
            splitRegex = new RegExp(splitPattern, 'g'),
            splitMatch = splitRegex.exec(filename);

        // If we have a match, proceed to add to arrays
        if (splitMatch) {
            // Remove non-channels (queries) from channel list
            var channelMatches = splitMatch[1].match(/^#.*$/);
            if (channelMatches) {
                channelArray.push(channelMatches[0].substring(1));
            }
        } 
    });

    // Make arrays unique
    channelArray = uniquify(channelArray);

    // Create object which gets passed to the template
    arrayObject = {};
    arrayObject.network = settings.network;
    arrayObject.user = settings.user;
    arrayObject.channelArray = channelArray;

    // Display found elements
    console.log('Found ' + channelArray.length + ' channels');

    res.render('index', { 
        title: 'Index',
        active_index: true,
        arrayObject: arrayObject
    });
});

/* GET home page. */
router.get('/:channel', function(req, res) {

    /* Parse possible dates */

    // Init element array
    var dateArray = [];

    var files = fs.readdirSync(settings.zncpath + '/users/' + settings.user + '/moddata/log/');

    files.forEach(function(filename){
        // Split filenames based on a pattern like <network>_<channel>_<date>
        var splitPattern = '^' + settings.network + '_#'+ req.params.channel + '_([0-9]*).log$';
        var splitRegex = new RegExp(splitPattern, 'g'),
            splitMatch = splitRegex.exec(filename);

        // If we have a match, proceed to add to arrays
        if (splitMatch) {
            // Turn into correct format for datepicker
            var dateRegex = /^([0-9]{4})([0-9]{2})([0-9]{2})$/g,
                dateMatch = dateRegex.exec(splitMatch[1]);
            if (dateMatch) {
                var newDate = dateMatch[1] + '-' + dateMatch[2] + '-' + dateMatch[3];
                dateArray.push(newDate);
            }
        } 
    });

    // Make arrays unique
    dateArray = uniquify(dateArray);

    // Create object which gets passed to the template
    arrayObject = {};
    arrayObject.network = settings.network;
    arrayObject.user = settings.user;
    arrayObject.channel = req.param('channel');
    arrayObject.dateArray = dateArray;

    // Display found elements
    console.log('Found ' + dateArray.length + ' possible dates');

    res.render('channel', { 
        title: 'Channel: ' + req.param('channel'),
        active_index: true,
        channel: req.params.channel,
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