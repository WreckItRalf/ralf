var express = require('express');
var router = express.Router();
var collector = require('../libs/collector.js');
var async = require('async');

/* GET users listing. */
router.get('/:userName', function(req, res, next) {
  
  var userName = req.params.userName;
  console.log('user: ' + userName);
  
  //call all collectors in parallel. 
  //then gather them into fields & send to view
  
  //dont send errors to parallel -- it won't wait for all functions to finish
  
  async.parallel([
    
    //gathers comments
    function(callback) {
      console.log('enter collector 1');
      
      collector(userName, 'comments', function(err, allComments) {
        console.log('left collector 1');
        callback(err, allComments)
      });
    },
    
    //gathers submissions
    function(callback) {
      console.log('enter collector 2');
      
      collector(userName, 'submitted', function(err, allSubmissions) {
        console.log('left collector 2');
        callback(err, allSubmissions)
      });
    },
  ], function(err, results) {
    
    console.log('after parallel');
    
    var date = getDateTime();
    var coms = results[0];
    var subs = results[1];
    
    console.log('# Comments: ' + coms.length)
    console.log('# of Submissions' + subs.length)
    
    var obj = {
      time: date,
      comments: coms,
      submissions: subs
    }
    
    //offfff to the view!
    res.json(obj);
  })

});

function getDateTime() {
  var now     = new Date(); 
  var year    = now.getFullYear();
  var month   = now.getMonth()+1; 
  var day     = now.getDate();
  var hour    = now.getHours();
  var minute  = now.getMinutes();
  var second  = now.getSeconds(); 
  if(month.toString().length == 1) {
      var month = '0'+month;
  }
  if(day.toString().length == 1) {
      var day = '0'+day;
  }   
  if(hour.toString().length == 1) {
      var hour = '0'+hour;
  }
  if(minute.toString().length == 1) {
      var minute = '0'+minute;
  }
  if(second.toString().length == 1) {
      var second = '0'+second;
  }   
  var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
  console.log('THE DATE: ' + dateTime);
  return dateTime;
}

module.exports = router;
