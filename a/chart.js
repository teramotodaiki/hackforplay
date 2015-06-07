$(function(){

	$('a[data-toggle="tab"][aria-controls="activerate"]').on('show.bs.tab', function(event) {
		$.get('../analytics/activeratesummary.php',{

		}, function(data) {
			var result = $.parseJSON(data);

			new Chart($('#activerate canvas').get(0).getContext("2d")).Line({
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
						data : result.values
					}
				]
			}, {
				responsive: true
			});
		});
	});

	$('a[data-toggle="tab"][aria-controls="playcount"]').on('show.bs.tab', function(event) {
		$.get('../analytics/playcountdist.php',{

		}, function(data) {
			var result = $.parseJSON(data);

			new Chart($('#playcount canvas').get(0).getContext("2d")).Line({
				labels : result.labels,
				datasets : [
					{
						label: "Playcount distribution this week",
						fillColor : "rgba(110,220,110,0.2)",
						strokeColor : "rgba(110,220,110,1)",
						pointColor : "rgba(110,220,110,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(110,220,110,1)",
						data : result.thisWeek
					},
					{
						label: "Playcount distribution last week",
						fillColor : "rgba(220,240,220,0.2)",
						strokeColor : "rgba(220,240,220,1)",
						pointColor : "rgba(220,240,220,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(220,220,220,1)",
						data : result.lastWeek
					}
				]
			}, {
				responsive: true
			});
		});
	});

	$('a[data-toggle="tab"][aria-controls="poststage"]').on('show.bs.tab', function(event) {
		$.get('../analytics/poststagedist.php',{

		}, function(data) {
			var result = $.parseJSON(data);

			new Chart($('#poststage canvas').get(0).getContext("2d")).Line({
				labels : result.labels,
				datasets : [
					{
						label: "Playcount distribution this week",
						fillColor : "rgba(110,220,110,0.2)",
						strokeColor : "rgba(110,220,110,1)",
						pointColor : "rgba(110,220,110,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(110,220,110,1)",
						data : result.thisWeek
					},
					{
						label: "Playcount distribution last week",
						fillColor : "rgba(220,240,220,0.2)",
						strokeColor : "rgba(220,240,220,1)",
						pointColor : "rgba(220,240,220,1)",
						pointStrokeColor : "#fff",
						pointHighlightFill : "#fff",
						pointHighlightStroke : "rgba(220,220,220,1)",
						data : result.lastWeek
					}
				]
			}, {
				responsive: true
			});
		});
	});

	$('a[data-toggle="tab"][aria-controls="continuoslylog"]').on('show.bs.tab', function(event) {
		$.get('../analytics/continuoslylogdist.php',{

		}, function(data) {
			var result = $.parseJSON(data);

			new Chart($('#continuoslylog canvas').get(0).getContext("2d")).Bar({
				labels : result.labels,
				datasets : [
					{
						fillColor : "rgba(60,110,220,0.5)",
						strokeColor : "rgba(60,110,220,0.8)",
						highlightFill: "rgba(60,110,220,0.75)",
						highlightStroke: "rgba(60,110,220,1)",
						data : result.values
					}
				]
			}, {
				responsive: true
			});
		});
	});
});