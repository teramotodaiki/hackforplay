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

	// 一覧取得
	$.post('../stage/fetchrecentpublished.php', {
		'length': 15
	}, function(data, textStatus, xhr) {
		console.log(data);
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('.h4p_stagelist.list-stage');
			console.log($list);
			result.values.forEach(function(stage){
				var item = $item.clone(true);
				item.find('.h4p_item-thumbnail').on('click', function() {
					location.href = '/s?id=' + stage.id;
				}).css('background-image', 'url(' + stage.thumbnail + ')');
				item.find('.title a').attr({
					href: '/s?id=' + stage.id,
					title: stage.title
				}).text(stage.title.length < 25 ? stage.title : stage.title.substr(0, 23) + '…');
				item.find('.author a').attr({
					href: '/m?id=' + stage.author_id,
					title: stage.author_name
				}).text(stage.author_name);
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
		'id': '301,302'
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
			console.log('coloumn ' + column + '/ surplus ' + surplus + '/ extra ' + extraNum);
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