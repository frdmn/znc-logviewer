var express = require('express'),
    fs = require('fs'),
    router = express.Router();

// Load settings file
var settings = require('../settings.json');

var channelObject = {};

// Call function to store channels and possible dates in object
channelObject = updateLogfiles();

// Timer to update the function above in runtime
setInterval(function(){
    channelObject = updateLogfiles();
// Reloop every hour
}, 1 * 60 * 60 * 1000);  

 
/* 
 * Routes
 */

/* GET home page. */
router.get('/', function(req, res) {
    /* Parse informations from log file names */

    // Init temporary channel array
    var channelArray = constructChannelArray(channelObject, null);

    // For each channel, push to array
    for (var channel in channelObject) {
        channelArray.push(channel);
    }

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

/* GET /c/:channel . */
router.get('/c/:channel/:date?', function(req, res) {
    /* Parse possible dates */

    var channelArray = constructChannelArray(channelObject, req.params.channel);

    // Init temporary date array
    var dateArray = [];

    // For each date, push to array
    for (var date in channelObject[req.params.channel]) {
        dateArray.push(channelObject[req.params.channel][date]);
    }

    // Create object which gets passed to the template
    arrayObject = {};
    arrayObject.network = settings.network;
    arrayObject.user = settings.user;
    arrayObject.channel = req.params.channel;
    arrayObject.channelArray = channelArray;
    arrayObject.dateArray = dateArray;

    // Display found elements
    console.log('Found ' + dateArray.length + ' possible dates');

    if (!req.params.date) {
        res.render('channel', { 
            title: 'Channel: ' + req.params.channel,
            active_index: true,
            channel: req.params.channel,
            arrayObject: arrayObject
        });
    } else {
        /* Read actual logfile to render */

        var array = fs.readFileSync(settings.zncpath + '/users/' + settings.user + '/moddata/log/' + settings.network + '_#' + req.params.channel + '_' + req.params.date + '.log').toString().split("\n"),
            messageObject = [];

        // For each line, push to messageObject
        for(i in array) {
            messageObject.push(array[i]);
        }

        res.render('channel', { 
            title: 'Channel: ' + req.params.channel + ' - ' + req.params.date,
            active_index: true,
            channel: req.params.channel,
            date: req.params.date,
            messages: messageObject,
            arrayObject: arrayObject
        });
    }
});

/*
 * Functions
 */

// Function to construct channelArray
function constructChannelArray(channelObject, activeChannel){
    // Init temporary channel array
    var channelArray = [];

    // For each channel, push to array
    for (var channel in channelObject) {
        // Init object that stores the channel and a boolean if the channel is the current active one
        var channelElement = {};

        channelElement.channelName = channel;

        if (channel == activeChannel) {
            channelElement.channelActive = true;
        } else {
            channelElement.channelActive = false;
        }

        // Push to channelArray
        channelArray.push(channelElement);
    }

    return channelArray;
}

// Function to update the logfiles
function updateLogfiles(){
    // Init channelObject element
    var channelObject = {};

    // Read all files in log file path
    var files = fs.readdirSync(settings.zncpath + '/users/' + settings.user + '/moddata/log/');

    // For each log file
    files.forEach(function(filename){
        // Split filenames based on a pattern like <network>_<channel>_<date>
        var splitPattern = '^' + settings.network + '_(.*)_([0-9]*).log$',
            splitRegex = new RegExp(splitPattern, 'g'),
            splitMatch = splitRegex.exec(filename);

        // If we have a match, proceed to add to arrays
        if (splitMatch) {
            // Remove non-channels (queries) from channel list
            var channelMatches = splitMatch[1].match(/^#.*$/);
            if (channelMatches) {
                // Remove hash character in front of channel name
                var channelMatchResult = channelMatches[0].substring(1);

                // If we didnt already initiated channelObject.test-channel initiate it
                if (!channelObject[channelMatchResult]) {
                    channelObject[channelMatchResult] = [];
                } 

                // Turn date into correct format for datepicker
                var dateRegex = /^([0-9]{4})([0-9]{2})([0-9]{2})$/g,
                    dateMatch = dateRegex.exec(splitMatch[2]);
                if (dateMatch) {
                    var possibleDate = dateMatch[1] + '-' + dateMatch[2] + '-' + dateMatch[3];
                    // Push into channelObject.test-channel
                    channelObject[channelMatchResult].push(possibleDate);
                } 
            }
        } 
    });

    // Display total amount of channels
    console.log('Found ' + Object.keys(channelObject).length + ' total channels...');

    // Display amount of possible dates per channel
    for (var channel in channelObject) {
        console.log(channel + ': ' + channel.length + ' possible dates');
    }

    return channelObject;
}

module.exports = router;