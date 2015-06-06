$(function(){

	$.get('../analytics/activeratesummary.php',{

	}, function(data) {
		var result = $.parseJSON(data);
		console.log(result);

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