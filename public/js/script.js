// Grab the URL of the website
var baseURL = window.location.origin;

// Save to first id to local storage
localStorage.setItem('first', $('#next').attr('data-id'));

// Listen for next button
$(document).on('click','#next', function() {
	// Get id from button
	var id = $(this).attr('data-id');
	// Get next article
	$.get(baseURL + "/next/" + id, buttons);
});

// Listen for prev button
$(document).on('click','#prev', function() {
	// Get id from button
	var id = $(this).attr('data-id');
	// Get next article
	$.get(baseURL + "/prev/" + id, buttons);
});

function buttons(res) {
	// Update content
	$('#picture>img').attr('src', res[0].imgURL);
	$('#content>h2').text(res[0].title);
	$('#content>p').text(res[0].synopsis);
	$('a.articleURL').attr('href', res[0].articleURL)
	// Check if previous button exists
	$buttons = $('#buttons');
	if ($buttons.children().length === 1) {
		// Add button
		var $but = $('<button>').text('Previous').attr('id','prev').attr('data-id',res[0]._id);
		$buttons.prepend($but);
	} else {
		// Check if the new id is the first id
		if (res[0]._id === localStorage.getItem('first')) {
			// If so remove
			$('#prev').remove();
		} else {
			// Just update prev button id
			$('#prev').attr('data-id',res[0]._id);
		}		
	}
	// Update next and post button id
	$('#next').attr('data-id',res[0]._id);
	$('#post').attr('data-id',res[0]._id);
}

// Listen for post button
$(document).on('click','#post', function() {
	// Get id from button
	var id = $(this).attr('data-id');
	// Get the comment
	$comment = $("#comment");
	var comment = $comment.val().trim();
	// Clear the comment
	$comment.val('');
	// Get next article
	$.post(baseURL + "/comment/" + id, {comment: comment}, function(res) {
		console.log(res);
	});
});