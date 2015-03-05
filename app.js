var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./routes');

var app = module.exports = express();

/**
 * Configuration
 */

// all environments
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


/**
 * Routes
 */

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

/**
 * Start Server
 */

var server = app.listen(app.get('port'), function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
});
