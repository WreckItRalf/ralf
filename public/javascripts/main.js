$("#nameInput").submit(function (event) {
    $("#nameInput").blur(); // unselects form
    $('#information').hide()

	
    // stop form from submitting normally
    event.preventDefault();
    
    var inputtedName = $('#userName').val();
	  console.log('beginning request for: ' + inputtedName)
	
    //Form validation
    if (checkUserName(inputtedName)) {
        $('#loading').show();
		
        $.ajax({
            type: 'GET',
            url: '/user/' + inputtedName,
            success: function (data) { successOccurs(inputtedName, data) } ,
            error: function (data) { errorOccurs(inputtedName, data) }
        })
    } else {
        //this should be added to an 'error' para instead.
        $('#information').show().text("The inputted name must conform to reddit's naming standards");
    }
})


//what runs upon successful ajax request
function successOccurs(inputtedName, data) {
    $('#loading').hide();
    
    if (data.error) {
        $('#information').show().text('Error occurred: ' + data.info)
    } else {
        console.log('success: ' + inputtedName);
        $('.JSON').text(JSON.stringify(data));
        
        var comms = data.comments;
        var subs = data.submissions;
        
        $('#information').show().text('Successfully gathered ' + comms.length + ' comments and ' + subs.length + ' submissions from /u/' + inputtedName)
    }
}

//catches ajax errors
function errorOccurs(inputtedName, data) {
    $('#loading').hide();
    $('#information').show().text('Unsuccessfully gathered ' + inputtedName + '\'s content for reasons: ' + data)
    console.log(data)
}


//checks user name against reddit's specs
function checkUserName(name) {
  
    var flag;
    var myRegex = /^([a-zA-Z0-9_-]){3,20}$/;

  
    if (myRegex.test(name)) {
        flag = true;
    } else {
        flag = false;
    }
  
    return flag;
}