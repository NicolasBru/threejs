'use strict';

// ---------------
// Default modules
// ---------------
var express = require('express');
var path = require('path');
var http = require('http');
var pkg = require('../package');
var app = express();

// ---------------------
// Default configuration
// ---------------------
var port = process.env.PORT || 4000;
app.set('port', port);
app.set('views', __dirname + '/');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express['static'](path.join(__dirname, '../public')));

// ---------
// JADE data
// ---------
app.locals.pretty = false;

// -------------------------
// Development configuration
// -------------------------
if ('development' === app.get('env')) {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
  app.locals.pretty = true;
}

app.get('/', function (req, res) {
  res.render('views/index');
});

http.createServer(app).listen(port, function(){
  console.log( pkg.title + " running on port " + port );
});