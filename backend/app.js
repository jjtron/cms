'use strict';

var express = require('express');

// set up redis db access
// ref https://www.tutorialspoint.com/redis/redis_security.htm 
//     for how redis db gets password set
var redisDb = require('express-redis')(6379, 'localhost', {password: 'def'}, 'cmsDb');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var user = require('./routes/user');
var redis = require('./routes/redis');
var login = require('./routes/login');

// set up error logger and error log file
var winstonLogger = require('./log.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(redisDb);

// serve static files from frontend directory
// disable this line and you should get the 
// /views/index.pug merged with /routes/index.js
// on a request for <scheme>://<host>:<port>/
app.use(express.static(__dirname + '/../frontend'));

// routes
app.use('/', index);
app.use('/', user);
app.use('/', redis);
app.use('/', login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
  });
}

// production error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json(err);
});

module.exports = app;

