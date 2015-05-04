$(function(){
	// インスタンス
	var $stageItem = $('<div>').addClass('col-md-4 col-sm-6 col-xs-12 h4p_item').append(
		$('<a>').append(
			$('<div>').addClass('h4p_item-thumbnail').append(
				$('<span>').addClass('h4p_item-src')
			)
		)
	).append(
		$('<div>').addClass('h4p_item-title').append(
			$('<a>').append($('<h4>'))
		)
	).append(
		$('<div>').addClass('h4p_item-footer').append(
			$('<p>').append($('<span>').html('作成者：<b><a></a></b>'))
		).append(
			$('<p>').append($('<span>').html('プレイ回数：<b>回</b>'))
		).append(
			$('<p>').append($('<span>').html('改造元：<b><a></a></b>'))
		).append(
			$('<p>').append($('<span>').addClass('label'))
		)
	);
	// ステージ一覧取得
	$.post('../stage/fetchmystage.php', {
		'length': 15
	}, function(data, textStatus, xhr) {
		console.log(data);
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('#h4p_stagelist');
			result.values.forEach(function(stage){
				var item = $stageItem.clone(true);
				item.children('a').attr({
					href: '/s?id=' + stage.id,
					title: stage.title
				}).children('.h4p_item-thumbnail').children('.h4p_item-src').text(stage.thumbnail);
				item.children('.h4p_item-title').children('a').attr({
					href: '/s?id=' + stage.id,
					title: stage.title
				}).children('h4').text(stage.title.length > 38 ? (stage.title.substr(0, 37) + '…') : stage.title);
				item.find('.h4p_item-footer p:nth-child(1) a').attr({
					href: '/__mypagelink__',
					title: stage.author_name
				}).text(stage.author_name);
				item.find('.h4p_item-footer p:nth-child(2) b').prepend(stage.playcount);
				if (stage.source_mode === 'replay') {
					item.find('.h4p_item-footer p:nth-child(3) a').attr({
						href: '/s?id=' + stage.source_id,
						title: stage.source_title
					}).text(stage.source_title);
				}else{
					item.find('.h4p_item-footer p:nth-child(3) span').text('オリジナルステージ');
				}
				var label_lv = (stage.state === 'published' ? 'label-success' :
								stage.state === 'judging'	? 'label-warning' :
								stage.state === 'rejected'	? 'label-danger' : 'label-default');
				item.find('.h4p_item-footer p:nth-child(4) span').addClass(label_lv).text(stage.state);

				item.appendTo($list);
			});
		}
	});

	$projectItem = $('<div>').addClass('col-md-4 col-sm-6 col-xs-12 h4p_item h4p_item-small').append(
		$('<div>').addClass('h4p_item-title').append(
			$('<a>').append($('<h4>'))
		)
	).append(
		$('<div>').addClass('h4p_item-footer').append(
			$('<p>').append($('<span>').html('作成日時：<b></b>'))
		)
	);

	// プロジェクト一覧取得
	$.post('../stage/fetchmyproject.php',{
		'length': 15
	}, function(data, textStatus, xhr) {
		console.log(data);
		switch(data){
			case 'no-session':
				$('#signinModal').modal('show');
				break;
			case 'parse-error':
				bsAlert('alert-danger', 'データの取得に失敗しました').append('#h4p_projectlist');
				break;
			default:
				var result = jQuery.parseJSON(data);
				var $list = $('#h4p_projectlist');
				result.values.forEach(function(project){
					var item = $projectItem.clone(true);
					var title = project.source_mode === 'replay' ? 'Re:' + project.source_title : 'オリジナルステージ';
					item.find('.h4p_item-title a').attr({
						'href': '__open project__',
						'title': title
					}).find('h4').text(title.length > 38 ? (title.substr(0, 37) + '…') : title);
					item.find('.h4p_item-footer p:nth-child(1) b').text(project.registered);

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
});