var express = require('express');
var router = express.Router();
var collector = require('../libs/collector.js');
var async = require('async');
var reddit = require('snoocore');

/* GET users listing. */
router.get('/:userName', function(req, res, next) {
  
    var userName = req.params.userName;
    console.log('user: ' + userName);
    /*
    call all collectors in parallel. 
    then gather them into fields & send to view
     */


    //perform name verification here


    async.parallel([
    
        //gathers comments
        function (callback) {
            parallelDevice(userName, 'comments', function (err, res) {
                callback(err, res)
            })
        },
    
        //gathers submissions
        function (callback) {
            parallelDevice(userName, 'submitted', function (err, res) {
                callback(err, res)
            })
        }

    ], function(err, results) {
        
        console.log('after parallel');
        var obj;
        
        //checks for true error status of all calls made
        function isError(elem, index, array) {
            return elem[0] == true;
        }

        if (results.some(isError)) {
            var errorString = results[0][1] + '\n' + results[1][1]
            
            obj = {
                error: true,
                info: errorString
            }
            
        } else {
            var date = getDateTime();
            var coms = results[0][1];
            var subs = results[1][1];
            
            obj = {
                error: false,
                time: date,
                comments: coms,
                submissions: subs
            }
        }
    
        //offfff to the view!
        res.json(obj);
    })

});

function parallelDevice(userName, type, callback) {
    console.log('enter ' + type + ' collector');
    
    collector(userName, type, function (errorStatus, data) {
        console.log('left ' + type + ' collector');
        //console.log(errorStatus)
        //console.log(data)
        
        var arr = [errorStatus, data];
        callback(null, arr);
    });

}

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
