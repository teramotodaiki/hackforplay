$(function () {
	$('a[data-toggle="tab"][aria-controls="summary"]').on('show.bs.tab', function(event) {
		var $exceptionItem =
			$('<tr>').append(
				$('<td>').addClass('message')
			).append(
				$('<td>').addClass('code')
			).append(
				$('<td>').addClass('file')
			).append(
				$('<td>').addClass('line')
			);
		// ExceptionMapのチャート
		$.post('../analytics/exceptionsummary.php',{
			'begin' : '2010-01-01 00:00:00',
			'end' : '2016-01-01 00:00:00',
			'attendance-token' : sessionStorage.getItem('attendance-token')
		}, function(data, textStatus, xhr) {
			var result = $.parseJSON(data);
			result.values.forEach(function(item){
				var eItem = $exceptionItem.clone(true);
				eItem.find('.message').text(item.Message);
				eItem.find('.code').text(item.Code);
				eItem.find('.file').text(item.File);
				eItem.find('.line').text(item.Line);
				eItem.appendTo('#summary .detail-container');
			});
		});

	});
});