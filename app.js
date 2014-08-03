// Require modules
var express = require('express')
    ,path = require('path')
    ,favicon = require('static-favicon')
    ,logger = require('morgan')
    ,cookieParser = require('cookie-parser')
    ,bodyParser = require('body-parser')
    ,handlebars  = require('express3-handlebars')
    ,fs = require('fs');

// Require our routes
var routeIndex = require('./routes/index')
    ,routeAbout = require('./routes/about');

// Load settings file
var settings = require('./settings.json');

/* Parse informations from log file names */

// Set a temporary test user, to read logs from
var testuser = "frdmn";

//  
var networkList = [],
    channelList = [],
    dateList = [];

var files = fs.readdirSync(settings.zncpath + '/users/' + testuser + '/moddata/log/');

files.forEach(function(filename){
    var filenameElements = filename.split("_");
    networkList.push(filenameElements[0]);
    channelList.push(filenameElements[1]);
    dateList.push(filenameElements[2]);
});

// Make arrays unique
networkList = uniquify(networkList);
channelList = uniquify(channelList);
dateList = uniquify(dateList);

// Remove "znc" element from networkList, to exclude ZNC status logs
var networkIndex = networkList.indexOf('znc');
if(networkIndex!=-1){
   networkList.splice(networkIndex, 1);
}

console.log(networkList);
// console.log(channelList);
// console.log(dateList);

/* Express setup */

// Init
var app = express();

// View setup
// app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Middleware setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Routes */

app.use('/', routeIndex);
app.use('/about', routeAbout);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/* error handlers */

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

// Function to remove duplicate elements from array
function uniquify(array){
    array = array.filter(function(elem, pos) {
        return array.indexOf(elem) == pos;
    });
    return(array);
}