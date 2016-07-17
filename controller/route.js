/**
 *  This route file makes the api call to fetch the images of cat.
*/

var express = require('express');
var request = require('request');
var router = express.Router();
var allconfig=require('../config/config');
var config = allconfig.config;

var logger = require('../logger');

var apiUrl;

var path = require('path');
var appDir = path.dirname(require.main.filename);

router.get('/animals/:page/', function(req, res) {
    apiUrl = 'https://api.gettyimages.com:443/v3/search/images?page='+req.params.page+'&phrase=cat&page_size=51';
    request.get({
        url : apiUrl,
        headers : {
            'Api-Key' : config.ApiKey
        }
    },function(error,response,body) {
        if(!error && response.statusCode == 200) {
            logger.info('Sucessfully returned image json for page number='+req.params.page);
            res.json(body);
        }
        else {
            logger.error('Unable to fetch reseult for requested page='+req.params.page);
            res.json('{}');
        }
    });

});

router.get('/', function(req, res) {
    logger.info('Sucessfully returned the home page');
    res.sendFile(appDir+'/public/index.html');
});

module.exports = router;
