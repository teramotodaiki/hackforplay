$(function(){
	new Chart($('canvas#summary1').get(0).getContext("2d")).Line({
		labels : ['a', 'b', 'c'],
		datasets : [
			{
				label: "Active User Rate",
				fillColor : "rgba(220,220,220,0.2)",
				strokeColor : "rgba(220,220,220,1)",
				pointColor : "rgba(220,220,220,1)",
				pointStrokeColor : "#fff",
				pointHighlightFill : "#fff",
				pointHighlightStroke : "rgba(220,220,220,1)",
				data : [1, 2, 3]
			}
		]
	}, {
		responsive: true
	});

});
