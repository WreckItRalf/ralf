// $('#submission').on('click', function() {
$("#nameInput").submit(function(event) {
	$('#information').hide()
	
	// stop form from submitting normally
	event.preventDefault();
	
	var inputtedName = $('#userName').val();
	console.log('begining request for: ' + inputtedName)
	
	//Form validation
	if (checkUserName(inputtedName)) {
		$('#loading').show();
		
		$.ajax({
			type: 'GET',
			url: '/user/' + inputtedName,
			success: function(data) {
				console.log('success: ' + inputtedName);
				$('#loading').hide();
				$('#JSON').text(JSON.stringify(data));
				
				var comms = data.comments || '';
				var subs = data.submissions || ''
				
				$('#information').show().text('Successfully gathered '+ comms.length +' comments and '+ subs.length +' submissions from ' + inputtedName)
			}
		})
	} else {
		//this should be added to an 'error' para instead.
		$('#information').show().text("The inputted name must conform to reddit's naming standards");
	}
});

//checks user name against reddit's specs, as well if it exists.
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