var express = require('express');
var router = express.Router();
var collector = require('../libs/collector.js');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render( 'index', {title: 'ralf'} )  
});


module.exports = router;
