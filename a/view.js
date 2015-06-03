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
			'project_id': project_id,
			'attendance-token': sessionStorage.getItem('attendance-token')
		}, function(data, textStatus, xhr) {
			if (data === '') {
				alert('Project is not exist');
			}else{
				var result = jQuery.parseJSON(data);
				$('#codeModal code').text(result.data);
			}
		});
	});
	$item.find('.h4p_accept-button').on('click', function() {
		var item = $(this).parents('.panel-body');
		var stage_id = $(this).data('stage_id');
		$.post('../stage/publishbyid.php', {
			'stage_id': stage_id,
			'attendance-token': sessionStorage.getItem('attendance-token')
		} , function(data, textStatus, xhr) {
			if (data === 'success') {
				item.after(bsAlert('alert-success', 'Successfly published'));
				item.remove();
			}else{
				item.after(bsAlert('alert-danger', 'Failed to publish'));
			}
		});
	});
	$item.find('.h4p_reject-button').on('click', function() {
		var item = $(this).parents('.panel-body');
		var stage_id = $(this).data('stage_id');
		$.post('../stage/rejectbyid.php', {
			'stage_id': stage_id,
			'attendance-token': sessionStorage.getItem('attendance-token')
		} , function(data, textStatus, xhr) {
			if (data === 'success') {
				item.after(bsAlert('alert-success', 'Successfly rejected'));
				item.remove();
			}else{
				item.after(bsAlert('alert-danger', 'Failed to reject'));
			}
		});
	});

	$.post('../stage/fetchjudgingall.php',{
		'attendance-token': sessionStorage.getItem('attendance-token')
	}, function(data, textStatus, xhr) {
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
				item.find('.h4p_accept-button').data('stage_id', stage.id);
				item.find('.h4p_reject-button').data('stage_id', stage.id);

				item.appendTo($list);
			});
		}
	});

	// _level のアラート _text を生成し、jQueryオブジェクトを返す
	function bsAlert (_level, _text) {
		var _bsalert =
		$('<div>').addClass('alert alert-dismissible fade in').addClass(_level).attr('role', 'alert').append(
			$('<button>').addClass('close').attr({
				'type' : 'button',
				'data-dismiss': 'alert',
				'aria-label': 'Close'
			}).append(
				$('<span>').attr('aria-hidden', 'true').html('&times;')
			)
		).append(
			$('<span>').text(_text)
		);
		return _bsalert;
	}
});