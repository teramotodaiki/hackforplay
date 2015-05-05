$(function(){
	// インスタンス
	var $item = $('<div>').addClass('col-md-4 col-sm-6 col-xs-12 h4p_item').append(
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
		)
	);
	// 一覧取得
	$.post('../stage/fetchrecentpublished.php', {
		'length': 15
	}, function(data, textStatus, xhr) {
		console.log(data);
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('#h4p_stagelist');
			result.values.forEach(function(stage){
				var item = $item.clone(true);
				item.children('a').attr({
					href: '/s?id=' + stage.id,
					title: stage.title
				}).children('.h4p_item-thumbnail').children('.h4p_item-src').text(stage.thumbnail);
				if(stage.title.length > 38) stage.title = stage.title.substr(0, 37) + '…';
				item.children('.h4p_item-title').children('a').attr({
					href: '/s?id=' + stage.id,
					title: stage.title
				}).children('h4').text(stage.title);
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

				item.appendTo($list);
			});
		}
	});
	// 空のステージ一覧
	$.post('../stage/fetchofficialbyid.php',{
		'id': '301,302'
	} , function(data, textStatus, xhr) {
		console.log(data);
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('#h4p_emptylist');
			result.values.forEach(function(stage){
				var item = $item.clone(true);
				item.children('a').attr({
					'href': '/s?id=' + stage.id,
					'title': stage.title
				}).children('.h4p_item-thumbnail').children('.h4p_item-src').text(stage.thumbnail);
				if(stage.title.length > 38) stage.title = stage.title.substr(0, 37) + '…';
				item.children('.h4p_item-title').children('a').attr({
					'href': '/s?id=' + stage.id,
					'title': stage.title
				}).children('h4').text(stage.title);
				item.find('.h4p_item-footer p:nth-child(1) span').remove();
				item.find('.h4p_item-footer p:nth-child(2) b').prepend(stage.playcount);
				item.find('.h4p_item-footer p:nth-child(3) span').remove();

				item.appendTo($list);
			});
		}
	});
});