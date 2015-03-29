$(document).ready(function () {
	
	$(document).bind('swipeleft', function() {
		history.back();
	});

	$('#remove-cache-button').on('tap', function(e) {
      	window.localStorage.clear();
 	});
	
});
