var express = require('express');
var router = express.Router();
var collector = require('../libs/collector.js');
var async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  //var userName = 'qilip';
  var obj = {
    title: 'ralf'
  }

  res.render('index', obj)
  
});


//test code
// router.get('/:ya', function(req, res){
//   // var query = req.query
//   var id = req.params.ya
//   res.send(id)
// })
    

/* GET containing user information  */
//need to look through nodeschool.io/express/ on recieving post request
//router.get('/user/')

module.exports = router;
