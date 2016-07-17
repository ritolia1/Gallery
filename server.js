/**
 * server.js - Contains the code to define the REST APIs used
 * to get pictures of random stuff like animals.
 */
var relic = require('newrelic');
var express = require('express');
var logger = require('./logger');
var bodyParser = require('body-parser');
var allconfig = require('./config/config');
var config = allconfig.config;

var app = express();

/**
 * configure app to use bodyParser()
 */
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.disable('x-powered-by'); //Remove the default express header

/**
 * Set port
 */
var port = process.env.PORT || config.serverPort;


app.use(require('./controller/route.js'));
app.use(express.static(__dirname + '/public'));

/**
 * START THE SERVER
 * 
 * =============================================================================
 */
app.listen(port).timeout = config.networkCallTimeout; //requests timeout in 30s
logger.debug('Starting the App at: localhost:'  + port);