$(function(){

	$.post('./playcount.php', {}, function(data, textStatus, xhr) {
		showAnimation($('.item-dashboard-playcount'), data >> 0);
	});

	$.post('./restagecount.php', {}, function(data, textStatus, xhr) {
		showAnimation($('.item-dashboard-restagecount'), data >> 0);
	});

	function showAnimation ($ele, value) {
		var i = 0, end = 30;
		var timer = setInterval(function () {
			var showing = (++i) / end * value >> 0;
			$ele.text(showing);
			if (i >= end) clearInterval(timer);
		}, 30);
	}

});
