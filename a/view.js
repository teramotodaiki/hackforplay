$(function(){
	var $item = $('<div>').addClass('col-md-12 panel').append(
		$('<div>').addClass('row panel-body').append(
			$('<div>').addClass('col-md-4').append(
				$('<div>').addClass('h4p_item-thumbnail').css({
					'margin-left':   'auto',
					'margin-right':  'auto',
					'width': 265,
					'height':176
				})
			)
		).append(
			$('<div>').addClass('col-md-4').append(
				$('<p>').append($('<h4>').addClass('title').html('<a></a>'))
			).append(
				$('<p>').append($('<span>').addClass('registered').html('作成日：<b></b>'))
			).append(
				$('<p>').append($('<span>').addClass('author').html('作成者：<b><a></a></b>'))
			).append(
				$('<p>').append($('<span>').addClass('source').html('改造元：<b><a></a></b>'))
			)
		).append(
			$('<div>').addClass('col-md-4').append(
				$('<button>').addClass('btn btn-success btn-lg btn-block h4p_code-button').attr({
					'data-toggle': 'modal',
					'data-target': '#codeModal'
				}).text('View code')
			).append(
				$('<button>').addClass('btn btn-primary btn-block h4p_accept-button').text('Accept this stage')
			).append(
				$('<button>').addClass('btn btn-danger btn-block h4p_reject-button').text('Reject this stage')
			)
		)
	);

	// イベント
	$item.find('.h4p_code-button').on('click', function() {
		var project_id = $(this).data('project_id');
		$.post('../stage/fetchprojectbyid.php',{
			'project_id': project_id
		}, function(data, textStatus, xhr) {
			console.log(data);
		});
	});

	$.post('../stage/fetchjudgingall.php',{

	}, function(data, textStatus, xhr) {
		console.log(data);
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('.list-judging');
			result.values.forEach(function(stage){
				var item = $item.clone(true);
				item.find('.h4p_item-thumbnail').on('click', function() {
					window.open('/s?id=' + stage.id, '_blank');
				}).css('background-image', 'url(' + stage.thumbnail + ')');
				item.find('.title a').attr({
					href: '/s?id=' + stage.id,
					title: stage.title,
					target: '_blank'
				}).text(stage.title.length < 25 ? stage.title : stage.title.substr(0, 23) + '…');
				if (stage.author_id !== null) {
					item.find('.author a').attr({
						href: '/m?id=' + stage.author_id,
						title: stage.author_name,
						target: '_blank'
					}).text(stage.author_name);
				}else{
					item.find('.author').text('いにしえのプログラマー');
				}
				item.find('.registered b').text(stage.registered);
				if (stage.source_mode === 'replay') {
					item.find('.source a').attr({
						href: '/s?id=' + stage.source_id,
						title: stage.source_title,
						target: '_blank'
					}).text(stage.source_title);
				}else{
					item.find('.source').text('オリジナルステージ');
				}
				item.find('.h4p_code-button').data('project_id', stage.project_id);

				item.appendTo($list);
			});
		}
	});
});