$(function(){

	$('.item-dashboard-value').each(function () {
		var i = 0, end = 30, $ele = $(this), value = $ele.data('value');
		var timer = setInterval(function () {
			var showing = (++i) / end * value >> 0;
			$ele.text(showing);
			if (i >= end) clearInterval(timer);
		}, 30);
	});

});
