"use strict";

var express  = require('express');
var router   = express.Router();

var data     = require('../functions/data.js');

router.get('/', function(req, res, next){
	res.render('index', data(req));
});

module.exports = router;