var reddit = require('./reddit.js');
var _ = require('lodash');

var collector = function (inputtedName, dataType, toController) {
  
  //perform check on userName & dataType
  var userName = inputtedName//checkUserName(inputtedName);
  
  //this becomes bigger when I change the routes to be
  //specific to each dataType
  var acceptedRequests = ['comments', 'submitted']
  
  //if username test pass & accepting certain data request
  if (_.includes(acceptedRequests, dataType) && userName != 'null') {
    
    //gather the requested data from reddit
    collect(dataType, userName, function(res) {
      
      //parse & sort this data
       processData(res, dataType, function(err, parsedChildren) {
        if (err) {
          console.error(err);
          return toController(null, null);
        } 
        
        return toController(null, parsedChildren);;
      });

    });
  } else {
    toController('Cannot gather inputted data: ' + dataType, null);
  }
}


//algo credit to: snoocore dev


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
  
  reddit('/u/$user/$dataType').listing({
    $user: userName,
    $dataType: dataType,
  }).then(handleSlice).then(toCollector);
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
  
  console.log('in parsing, '+dataType+' count: ' + collection.length)
  
  if (collection.length > 0) {
    
    //raw data pack, get all fields
    console.log(collection[0]);
    
    collection.forEach(function(piece) {
      
      //fields shared by all dataTypes
      //***May need to change depending on upvotes/downvotes
      
      var obj = {
          subreddit : piece.data.subreddit,
          gilded : piece.data.gilded, 
          score : piece.data.score, 
          over_18 : piece.data.over_18, 
          created_utc : piece.data.created_utc
      }
      
      
      //REFACTOR THIS.
      //Use an external helper file to hold all needed fields
      
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
        return toCollector(null, parsed);
      }
    });
  } else {
    return toCollector('No data in '+dataType+' collection.', null);
  }
}


function checkUserName(name) {
  var isOkay;
  
  //letters, numbers, dash and underscore
  // 3 - 20 characters
  
  //also check to see if name exists
  //do this by asking for /u/name. If you get a 404, doesnt exist
  
  // if (/* pass regex expression */) {
    
  // }
  
  return isOkay;
}

module.exports = collector;