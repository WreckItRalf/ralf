var reddit = require('./reddit.js');
//var _ = require('lodash');

var collector = function (userName, dataType, toController) {
  
    //var acceptedRequests = ['comments', 'submitted']
    var isErr = true,
        noErr = false;  
    
    //if username test pass & accepting certain data request
    if (/* _.includes(acceptedRequests, dataType) && */ (userName != 'null' || userName != undefined)) {
        
        //gather the requested data from reddit
        collect(dataType, userName, function(data) {
            
            //parse & sort this data
            processData(data, dataType, function (parsedChildren) {
                toController(noErr, parsedChildren);    
            });
        });
    } else {
      //something truly hit the fan
      toController(isErr, 'Cannot gather inputted data: ' + dataType);
  }
}


/* Gathers all of a specific data type from a user */

function collect(dataType, userName,/*dateStart, dateEnd*/ toCollector) {
    var children = [];

    function handleSlice(slice) {
        if (slice.empty) {
            return children;
        }
    
        children = children.concat(slice.children);
        return slice.next().then(handleSlice);
    }
 
    console.log('reddit call commencing for: ' + dataType);
    
    //the reddit call
    reddit('/u/$user/$dataType').listing({
        $user: userName,
        $dataType: dataType,
    }).then(handleSlice).then(function (data) {
        toCollector(data)
    })


}


function printSlice(slice) {
  slice.children.forEach(function(child, i) {
    console.log(slice.count + i + 1, child.data.body.substring(0, 20) + '...');
  });
}
 
/* Sorts data, places it into streamlined objects */
function processData(collection, dataType, toCollector) {
  var parsed = [];
  var count = 0;
    
  if (collection.length > 0) {
        
    collection.forEach(function(piece) {
      
      //fields shared by all dataTypes      
      var obj = {
          subreddit : piece.data.subreddit,
          gilded : piece.data.gilded, 
          score : piece.data.score, 
          over_18 : piece.data.over_18, 
          created_utc : piece.data.created_utc
      }
      
      
      //REFACTOR THIS.
      //Use an external helper file to hold all needed fields (?)
      
      switch (dataType) {
        
        case 'comments':
          obj['kind'] = piece.kind;
          obj['link_title'] = piece.data.link_title; 
          obj['replies'] = piece.data.replies;
          obj['user_reports'] = piece.data.user_reports;
          obj['body'] = piece.data.body;
          obj['permalink'] = piece.data.link_url + piece.data.id;
          break;
          
        case 'submitted':
          obj['kind'] = piece.kind;
          obj['permalink'] = piece.data.permalink;
          obj['num_comments'] = piece.data.num_comments;
          obj['num_reports'] = piece.data.num_reports;
          obj['title'] = piece.data.title;
          obj['url'] = piece.data.url;
          break;
          
          default:
            break;
      }
      
      parsed.push(obj);
      ++count;
      
      if (count === collection.length) {
        return toCollector(parsed);
      }
    });
  } else {
    return toCollector('');
  }
}

module.exports = collector;
