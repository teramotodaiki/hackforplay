$(function(){

	// リジェクトされた理由を表示するモーダル
	var $reasonItem =
	$('<div>').addClass('alert alert-danger').append(
		$('<p>').addClass('message')
	);
	$('#reasonModal').on('show.bs.modal', function(event) {
		$(this).find('.modal-body').children().remove();
		var $button = $(event.relatedTarget);
		var reason_json = $button.data('reason');
		var reason = $.parseJSON(reason_json);
		reason.forEach(function(item){
			var reasonItem = $reasonItem.clone(true);
			reasonItem.text(item);
			reasonItem.appendTo('#reasonModal .modal-body');
		});
	});

	var $projectItem = $('<div>').addClass('col-lg-4 col-md-6 col-sm-6 col-xs-12').append(
		$('<div>').addClass('thumbnail').append(
			$('<img>')
		).append(
			$('<div>').addClass('caption').append(
				$('<button>').addClass('btn btn-lg btn-block btn-default h4p_open-project').text('開く').attr('data-loading-text', 'データの取得中…')
			).append(
				$('<pre>').addClass('panel-title')
			).append(
				$('<p>').append($('<span>').addClass('registered').html('作成日時：<b></b>'))
			).append(
				$('<p>').append($('<span>').addClass('source').html('改造元：<b></b>'))
			).append(
				$('<button>').addClass('btn btn-link btn-block h4p_delete-project').text('このプロジェクトを削除').attr('data-loading-text', 'お待ちください…')
			)
		)
	);
	var $projectItem_fixButton = $('<button>').text('元に戻す').addClass('btn btn-link btn-block h4p_fix-project');

	$projectItem.find('.h4p_open-project').on('click', function(event) {
		var loading = $(this).button('loading');
		var token = $(this).attr('project-token');
		$.post('../stage/fetchprojectbytoken.php', {
			'token': token,
			'attendance-token': sessionStorage.getItem('attendance-token')
		} , function(data, textStatus, xhr) {
			loading.button('reset');
			switch(data){
				case 'no-session':
					$('#signinModal').modal('show');
					break;
				case 'missing-project':
					break;
				case 'parse-error':
					break;
				default:
					var value = jQuery.parseJSON(data);
					sessionStorage.setItem('project-token', token);
					sessionStorage.setItem('restaging_code', value.data);
					location.href = '/s?id=' + value.source_id + '&mode=restaging';
					break;
			}
		});
	});
	$projectItem.find('.h4p_delete-project').on('click', function() {
		var loading = $(this).button('loading');
		var token = $(this).attr('project-token');
		var panel = $(this).parents('.thumbnail');
		$.post('../project/deletebytoken.php', {
			'token': token,
			'attendance-token': sessionStorage.getItem('attendance-token')
		} , function(data, textStatus, xhr) {
			loading.button('reset');
			if (data === 'success') {
				panel.find('img').remove();
				panel.find('.caption').fadeOut('fast', function() {
					panel.append(
						bsAlert('alert-success', '削除できました')
					).append(
						$projectItem_fixButton.clone(true).attr('project-token', token)
					);
				});
			}else{
				panel.append(bsAlert('alert-danger', '削除に失敗しました'));
			}
		});
	});
	$projectItem_fixButton.on('click', function() {
		var loading = $(this).button('loading');
		var token = $(this).attr('project-token');
		var panel = $(this).parents('.thumbnail');
		panel.find('.alert').remove();
		$.post('../project/canceldeletionbytoken.php',{
			'token': token,
			'attendance-token': sessionStorage.getItem('attendance-token')
		}, function(data, textStatus, xhr) {
			loading.button('reset');
			if (data === 'failed'){
				panel.prepend(bsAlert('alert-danger', '削除に失敗しました'));
			}else{
				var project = jQuery.parseJSON(data);
				var item = $projectItem.clone(true);
				item.find('.thumbnail img').attr('src', project.thumbnail || 'img/noimage.png');
				item.find('.panel-title').text(project.data);
				var title = project.source_title;
				item.find('.source b').text(title.length > 38 ? (title.substr(0, 37) + '…') : title);
				item.find('.registered b').text(project.registered);
				item.find('.caption button').attr('project-token', project.token);
				panel.parent().after(item);
				panel.parent().remove();
			}
		});
	});

	// プロジェクト一覧取得
	$.post('../stage/fetchmyproject.php',{
		'length': 15,
		'attendance-token': sessionStorage.getItem('attendance-token')
	}, function(data, textStatus, xhr) {
		switch(data){
			case 'no-session':
				$('#signinModal').modal('show');
				break;
			case 'parse-error':
				bsAlert('alert-danger', 'データの取得に失敗しました').append('#h4p_projectlist');
				break;
			default:
				var result = jQuery.parseJSON(data);
				var $list = $('.h4p_projectlist');
				result.values.forEach(function(project){
					var item = $projectItem.clone(true);
					item.find('.thumbnail img').attr('src', project.thumbnail || 'img/noimage.png');
					item.find('.panel-title').text(project.data);
					var title = project.source_title;
					item.find('.source b').text(title.length > 38 ? (title.substr(0, 37) + '…') : title);
					item.find('.registered b').text(convertLocaleTimeString(project.registered));
					item.find('.caption button').attr('project-token', project.token);

					item.appendTo($list);
				});
				break;
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

	function convertLocaleTimeString (datetimeoffset) {
		var _t = datetimeoffset.indexOf(' ');
		datetimeoffset = datetimeoffset.substr(0, _t) + 'T' + datetimeoffset.substr(_t + 1).replace(' ', '');
		var timestamp = new Date(datetimeoffset).getTime();
		var date = new Date(timestamp - 60 * 1000 * new Date().getTimezoneOffset());
		return date.toLocaleString();
	}
});