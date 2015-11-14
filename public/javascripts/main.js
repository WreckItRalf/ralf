// $('#submission').on('click', function() {
$("#nameInput").submit(function(event) {
	$('#information').hide()
	$('#loading').show();
	
	/* stop form from submitting normally */
	event.preventDefault();
	
	var inputtedName = $('#userName').val();
	console.log('begining request for: ' + inputtedName)
	

	
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
})