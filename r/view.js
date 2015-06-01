$(function(){
	// インスタンス
	var $item = $('<div>').addClass('col-lg-4 col-md-6 col-sm-6 col-xs-12 h4p_item').append(
	).append(
		$('<div>').addClass('h4p_item-frame h4p_item-transform').append(
			$('<img>').addClass('h4p_item-inner').attr('src', '../img/cassette/inner_tab.png')
		)
	).append(
		$('<div>').addClass('h4p_item-frame h4p_item-front h4p_item-transform').append(
			$('<div>').addClass('h4p_item-frame h4p_item-thumbnail').css({
				'top':   41,
				'left':  47,
				'width': 265,
				'height':176,
				'border-top-left-radius': '4px 4px',
				'border-top-right-radius': '4px 4px',
			})
		).append(
			$('<div>').addClass('h4p_item-frame').css({
				'top':   217,
				'left':   47,
				'width': 265,
				'height':126,
				'padding': '5px 5px',
				'background-color': 'rgb(255,255,255)',
				'border-bottom-left-radius': '12px 12px',
				'border-bottom-right-radius': '4px 4px'
			}).append(
				$('<p>').addClass('title').css('margin', '8px 0').append($('<a>'))
			).append(
				$('<p>').append($('<span>').addClass('author').html('作成者：<b><a></a></b>'))
			).append(
				$('<p>').append($('<span>').addClass('playcount').html('プレイ回数：<b>回</b>'))
			).append(
				$('<p>').append($('<span>').addClass('source').html('改造元：<b><a></a></b>'))
			)
		)
	);
	// マウスオーバーイベント
	$item.find('.h4p_item-front').hover(function() {
		$(this).parent().find('.h4p_item-inner').attr('src', '../img/cassette/inner_notab.png');
		$(this).parent().find('.h4p_item-transform').addClass('transform-on');
	}, function() {
		$(this).parent().find('.h4p_item-inner').attr('src', '../img/cassette/inner_tab.png');
		$(this).parent().find('.h4p_item-transform').removeClass('transform-on');
	});

	// 一覧取得（１つ多く取得して、次のページがあるかどうか調べる）
	var view_param_length = 15;
	$.post('../stage/fetchrecentpublished.php', {
		'start': sessionStorage.getItem('view_param_start'),
		'length': view_param_length + 1,
		'attendance-token': sessionStorage.getItem('attendance-token')
	}, function(data, textStatus, xhr) {
		console.log(data);
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('.h4p_stagelist.list-stage');
			console.log($list);
			var view_param_start = parseInt(sessionStorage.getItem('view_param_start'), 10);
			if (result.values.length > view_param_length) {
				// 次のページが存在する
				var next = view_param_start + view_param_length;
				$('a.go_page_next').attr('href', location.pathname + '?start=' + next + '#page_anchor');
				delete result.values[view_param_length];
			}else{
				$('a.go_page_next').remove();
			}
			if (view_param_start > 0) {
				// 前のページが存在する
				var previous = Math.max(view_param_start - view_param_length, 0);
				$('a.go_page_previous').attr('href', location.pathname + '?start=' + previous + '#page_anchor');
			}else{
				$('a.go_page_previous').remove();
			}
			result.values.forEach(function(stage){
				var item = $item.clone(true);
				item.find('.h4p_item-thumbnail').on('click', function() {
					window.open('/s?id=' + stage.id, '_blank');
				}).css('background-image', 'url(' + stage.thumbnail + ')');
				item.find('.title a').attr({
					href: '/s?id=' + stage.id,
					title: stage.title
				}).text(stage.title.length < 25 ? stage.title : stage.title.substr(0, 23) + '…');
				if (stage.author_id !== null) {
					item.find('.author a').attr({
						href: '/m?id=' + stage.author_id,
						title: stage.author_name
					}).text(stage.author_name);
				}else{
					item.find('.author').text('いにしえのプログラマー');
				}
				item.find('.playcount b').prepend(stage.playcount);
				if (stage.source_mode === 'replay') {
					item.find('.source a').attr({
						href: '/s?id=' + stage.source_id,
						title: stage.source_title
					}).text(stage.source_title);
				}else{
					item.find('.source').text('オリジナルステージ');
				}

				item.appendTo($list);
			});
			alignmentOnResize();
		}
	});
	// 空のステージ一覧
	$.post('../stage/fetchofficialbyid.php',{
		'id': '301,302',
		'attendance-token': sessionStorage.getItem('attendance-token')
	} , function(data, textStatus, xhr) {
		console.log(data);
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('.h4p_stagelist.list-empty');
			result.values.forEach(function(stage){
				var item = $item.clone(true);
				item.find('.h4p_item-thumbnail').on('click', function() {
					location.href = '/s?id=' + stage.id;
				}).css('background-image', 'url(' + stage.thumbnail + ')');
				if(stage.title.length > 38) stage.title = stage.title.substr(0, 37) + '…';
				item.find('.title a').attr({
					href: '/s?id=' + stage.id,
					title: stage.title
				}).text(stage.title);
				item.find('.author').remove();
				item.find('.playcount b').prepend(stage.playcount);
				item.find('.source').text('公式ステージ');

				item.appendTo($list);
			});
			alignmentOnResize();
		}
	});

	// ページナンバーを選択するビュー
	var $pageLink = $('<a>').addClass('btn btn-lg btn-default');
	var view_param_num = parseInt(sessionStorage.getItem('view_param_num'), 10);
	var pageNum = view_param_num / view_param_length + 1 >> 0;
	for (var i = 0; i < pageNum; i++) {
		var pageLink = $pageLink.clone(true);
		var n = i * view_param_length;
		pageLink.attr('href', location.pathname + '?start=' + n + '#page_anchor').text(i).appendTo('.page-numbers');

		var here = parseInt(sessionStorage.getItem('view_param_start'), 10) / view_param_length >> 0;
		if (i === here) {
			pageLink.attr('disabled', true);
		}
	}


	// あまりを詰めるためのアイテム
	var $blank = $('<div>').addClass('col-lg-4 col-md-6 col-sm-6 col-xs-12 h4p_item h4p_item-blank').append();

	// サイズ調整 ロード時とリサイズ時
	alignmentOnResize();
	var resized_timeout_id = null;
	$(window).on('resize', function() {
		clearTimeout(resized_timeout_id);
		resized_timeout_id = setTimeout(alignmentOnResize, 100);
	});
	// リサイズ時に変わる数値
	function alignmentOnResize () {
		$('.h4p_stagecontainer .container').each(function(index, el) {
			var $con = $(el);
			// あまり
			var column = $con.find('.h4p_stagelist').width() / $con.find('.h4p_item:first').width();
			var itemNum = $con.find('.h4p_item').length;
			var blankNum = $con.find('.h4p_item.h4p_item-blank').length;
			var surplus = (itemNum - blankNum) % column;
			var extraNum = surplus === 0 ? blankNum : blankNum - (column - surplus); // + : 過多、- : 不足
			if (extraNum > 0) {
				for (var i = 0; i < extraNum; i++) {
					$con.find('.h4p_item.h4p_item-blank:first').remove();
				}
			}else if(extraNum < 0){
				extraNum = -extraNum;
				for (var i = 0; i < extraNum; i++) {
					var blank = $blank.clone(true);
					$con.find('.h4p_stagelist').append(blank);
				}
			}
			// 左右の枠
			var containerHeight = $con.find('.h4p_stagelist').height();
			$con.find('.h4p_bar-left').height(containerHeight);
			$con.find('.h4p_bar-right').height(containerHeight);
		});
	}

});