$(function(){

	$.post('./sessiontime.php', {}, function(data, textStatus, xhr) {
		var result = $.parseJSON(data);
		if (!result) return;

		new Chart($('canvas#sessiontime').get(0).getContext("2d")).Bar({
			labels : result.labels,
			datasets : [
				{
					label: "Active User Rate",
					fillColor : "rgba(220,220,220,0.2)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(220,220,220,1)",
					data : result.thisweek.map(function(num) {
						return (num / 360 | 0) / 10;
					})
				}
			]
		}, {
			responsive: true
		});

	});

	$.post('./projectnum.php', {}, function(data, textStatus, xhr) {
		var result = $.parseJSON(data);
		if (!result) return;

		new Chart($('canvas#projectnum').get(0).getContext("2d")).Bar({
			labels : result.labels,
			datasets : [
				{
					label: "Active User Rate",
					fillColor : "rgba(220,220,220,0.2)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					pointHighlightFill : "#fff",
					pointHighlightStroke : "rgba(220,220,220,1)",
					data : result.thisweek
				}
			]
		}, {
			responsive: true
		});

	});

});
