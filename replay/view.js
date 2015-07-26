$(function() {
	$('.container a>img.img-rounded').each(function(index, el) {
		var width = $(el).width();
		$(el).height(width / 1.5);
	});
});