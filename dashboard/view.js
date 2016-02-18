$(function(){

	$.post('./playcount.php', {}, function(data, textStatus, xhr) {
		$('.item-dashboard-playcount').text(data);
	});

	$.post('./restagecount.php', {}, function(data, textStatus, xhr) {
		$('.item-dashboard-restagecount').text(data);
	});

});
