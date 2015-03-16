var express = require('express');
var path = require('path');
var index = require('./routes/index');
var errorhandler = require('errorhandler');
var log = (process.argv[2]==='-l');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// logging if 1st arg is equal to '-l'
if(log){
  var morgan = require('morgan');
  app.use(morgan('dev', {}));
}

//static folder
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Routes
 */

// Routes
app.use('/', index);

//error handling
app.use(errorhandler());

/**
 * Start Server
 */

var server = app.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('AnguLearn is listening at http://%s:%s', host, port);
});
