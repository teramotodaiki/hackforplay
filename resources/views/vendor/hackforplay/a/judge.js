$(function () {
	$('a[data-toggle="tab"][aria-controls="judge"]').on('show.bs.tab', function(event) {

		var $item = $('<div>').addClass('col-xs-12 panel').append(
			$('<div>').addClass('row panel-body').append(
				$('<div>').addClass('col-xs-4').append(
					$('<div>').addClass('h4p_item-thumbnail').css({
						'margin-left':   'auto',
						'margin-right':  'auto',
						'width': 265,
						'height':176
					})
				)
			).append(
				$('<div>').addClass('col-xs-4').append(
					$('<p>').append($('<h4>').addClass('title').html('<a></a>'))
				).append(
					$('<p>').append($('<span>').addClass('registered').html('作成日：<b></b>'))
				).append(
					$('<p>').append($('<span>').addClass('author').html('作成者：<b><a></a></b>'))
				).append(
					$('<p>').append($('<span>').addClass('source').html('改造元：<b><a></a></b>'))
				)
			).append(
				$('<div>').addClass('col-xs-4').append(
					$('<button>').addClass('btn btn-success btn-lg btn-block h4p_code-button').attr({
						'data-toggle': 'modal',
						'data-target': '#codeModal'
					}).text('View code')
				).append(
					$('<button>').addClass('btn btn-primary btn-block h4p_accept-button').text('Accept this stage')
				).append(
					$('<button>').addClass('btn btn-danger btn-block h4p_reject-button').attr({
						'data-toggle': 'modal',
						'data-target': '#rejectModal'
					}).text('Reject this stage')
				)
			)
		);

		// イベント
		$item.find('.h4p_code-button').on('click', function() {
			var rawcode = $(this).data('rawcode');
			$('#codeModal code').text(rawcode);
		});
		$item.find('.h4p_accept-button').on('click', function() {
			var item = $(this).parents('.panel-body').first();
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

		function fetchTask () {
			$.post('../stage/fetchjudgingall.php',{
				'attendance-token': sessionStorage.getItem('attendance-token')
			}, function(data, textStatus, xhr) {
				if (data === 'parse-error') {
				}else{
					var result = jQuery.parseJSON(data);
					var $list = $('.list-judging');
					$list.children().remove();
					if (result.values.length < 1) {
						$('<p>').addClass('alert alert-danger').text('No judging stage').appendTo($list);
					}
					result.values.forEach(function(stage){
						var item = $item.clone(true);
						item.find('.h4p_item-thumbnail').on('click', function() {
							window.open('/s?id=' + stage.id, '_blank');
						});
						if (stage.thumbnail) {
							item.find('.h4p_item-thumbnail').css('background-image', 'url(' + stage.thumbnail + ')');
						}
						item.find('.title a').attr({
							href: '/s?id=' + stage.id,
							title: stage.title,
							target: '_blank'
						}).text((stage.title || '').length < 25 ? stage.title : stage.title.substr(0, 23) + '…');
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
						item.find('.h4p_code-button').data('rawcode', stage.rawcode);
						item.find('.h4p_accept-button').data('stage_id', stage.id);
						item.find('.h4p_reject-button').data('stage_id', stage.id);

						item.appendTo($list);
					});
				}
			});
		}
		fetchTask();

		var $button = false;

		// モーダルの初期化
		var $reasonItem =
		$('<div>').addClass('checkbox').append(
			$('<label>').append(
				$('<input>').attr('type', 'checkbox')
			).append(
				$('<span>').addClass('message')
			)
		);

		$.post('../stage/getrejectreasons.php',{
			'attendance-token': sessionStorage.getItem('attendance-token')
		}, function(data, textStatus, xhr) {
			var result = $.parseJSON(data);

			result.values.forEach(function(item){
				var reasonItem = $reasonItem.clone(true);
				reasonItem.find('input').val(item.ID);
				reasonItem.find('.message').text(item.Message);
				reasonItem.prependTo('#rejectModal form');
			});
		});

		$('#rejectModal').on('show.bs.modal', function(event) {
			$button = $(event.relatedTarget);
			$(this).find('input[type="checkbox"]:checked').prop('checked', false);

		}).find('form').submit(function(event) {
			event.preventDefault();

			var reasons = [];
			$(this).find('input[type="checkbox"]:checked').each(function(index, el) {
				reasons.push(el.value);
			});
			var reasons_json = JSON.stringify(reasons);

			var item = $button.parents('.panel-body').first();
			var stage_id = $button.data('stage_id');
			var notice = $(this).find('textarea[name="notice"]').val();
			$.post('../stage/rejectbyid.php', {
				'stage_id': stage_id,
				'notice': notice,
				'reasons': reasons_json,
				'attendance-token': sessionStorage.getItem('attendance-token')
			} , function(data, textStatus, xhr) {
				if (data === 'success') {
					item.after(bsAlert('alert-success', 'Successfly rejected'));
					item.remove();
				}else{
					item.after(bsAlert('alert-danger', 'Failed to reject'));
				}
			});

			$('#rejectModal').modal('hide');
		});

	});
});
