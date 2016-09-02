// main.js
$( document ).ready(function() {
    $(".poll_row").each(function(){
		$(this).attr("href", "/polls/" + $(this).attr('id'));
	});
});