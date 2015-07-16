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
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('.h4p_stagelist.list-stage');
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
				});
				if (stage.thumbnail) {
					item.find('.h4p_item-thumbnail').css('background-image', 'url(' + stage.thumbnail + ')');
				}
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
		if (data === 'parse-error') {
		}else{
			var result = jQuery.parseJSON(data);
			var $list = $('.h4p_stagelist.list-empty');
			result.values.forEach(function(stage){
				var item = $item.clone(true);
				item.find('.h4p_item-thumbnail').on('click', function() {
					location.href = '/s?id=' + stage.id;
				});
				if (stage.thumbnail) {
					item.find('.h4p_item-thumbnail').css('background-image', 'url(' + stage.thumbnail + ')');
				}
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

	// コメント
	var $com =
	$('<div>').css('cursor', 'pointer').append(
		$('<div>').addClass('panel panel-default').append(
			$('<div>').addClass('panel-body row').append(
				$('<div>').addClass('col-md-6 comment-thumbnail').append(
					$('<img>').addClass('h4p_thumbnail')
				)
			).append(
				$('<div>').addClass('col-md-6').append(
					$('<div>').addClass('row').append(
						$('<div>').addClass('col-md-2 comment-header').append(
							$('<img>').addClass('img-circle comment-item-padding')
						)
					).append(
						$('<div>').addClass('col-md-10 comment-header').append(
							$('<div>').addClass('text-muted comment-item-padding nickname')
						).append(
							$('<div>').addClass('comment-item-padding hashtag')
						)
					).append(
						$('<div>').addClass('col-md-12 comment-body overflow-auto')
					).append(
						$('<div>').addClass('col-md-12 comment-footer').append(
							$('<p>').addClass('label pull-right')
						)
					)
				)
			)
		)
	);

	// アイテムをクリック => 全体を右に移動 | ステージを開く | 全体を左に移動
	$com.on('click', function(event) {

		var centerIndex = $('.h4p_topic-comment .left-to-center').length > 0 ?
			$('.h4p_topic-comment .left-to-center').data('index') :
			$('.h4p_topic-comment .right-to-center').data('index');
		var offset = $(this).data('index') - centerIndex;
		var length = $('.h4p_topic-comment>div').length;

		switch (offset) {
			case -1:
			case length - 1:
				moveCommentList('right');
				break;
			case 0:
				open('/s?id=' + $(this).data('stageid'), '_blank');
				break;
			case 1:
			case -length + 1:
				moveCommentList('left');
				break;
		}
	});

	$.post('../stage/fetchrecentcomments.php', {
		'start' : 0,
		'length' : 10,
		'attendance-token' : sessionStorage.getItem('attendance-token')
	} , function(data, textStatus, xhr) {

		switch(data) {
			case 'parse-error':
				break;
			default:
				var result = JSON.parse(data);
				result.values.forEach(function(item, index, array) {

					var com = $com.clone(true, true);
					switch (index) {
						case 0: com.addClass('right-to-center'); break;
						case 1: com.addClass('outerright-to-right'); break;
						case array.length - 1: com.addClass('center-to-left'); break;
						case array.length - 2: com.addClass('left-to-outerleft');　break;
						default: com.addClass('hidden'); break;
					}
					com.data('index', index);
					com.data('stageid', item.StageID);
					com.find('.comment-thumbnail img').attr('src', item.Thumbnail);
					if (item.Nickname) {
						if (item.ProfileImageURL) {
							com.find('.comment-header img').attr('src', item.ProfileImageURL);
						} else {
							com.find('.comment-header img').attr('src', item.Gender === 'male' ? '/m/icon_m.png' : '/m/icon_w.png');
						}
						com.find('.nickname').text(item.Nickname);
					}
					com.find('.hashtag').text(item.Hashtag);
					item.Message.split('\n').forEach(function (item) {
						$(this).append(
							$('<p>').addClass('comment-item-padding').text(item)
						);
					}, com.find('.comment-body'));
					if (item.Tags[0]) {
						com.find('.comment-footer p').text(item.Tags[0].DisplayString).css('background-color', item.Tags[0].LabelColor);
					}
					$(this).append(com);

				}, $('.h4p_topic-comment'));
		}
	});

	function moveCommentList (direction) {

		var centerIndex = $('.h4p_topic-comment .left-to-center').length > 0 ?
			$('.h4p_topic-comment .left-to-center').data('index') :
			$('.h4p_topic-comment .right-to-center').data('index'); // 現在のセンターのインデックス
		var listLength = $('.h4p_topic-comment>div').length; // リストの長さ
		var appearIndex = (centerIndex + (direction === 'left' ? 2 : listLength - 2)) % listLength; // 新しく出現させるindex
		var appearClass = direction === 'left' ? 'outerright-to-right' : 'outerleft-to-left';// 新しく出現するアイテムのクラス

		// 移動処理
		$('.h4p_topic-comment>div').each(function(index, el) {

			// 現在位置を取得
			var position = null;
			el.className.split(' ').forEach(function(item) {

				if (item.indexOf('-to-') !== -1) {
					position = item.split('-to-')[1];
					el.classList.remove(item);
				}

			});

			if ($(el).data('index') >> 0 === appearIndex) {


				// hidden => 端へ表示されるアイテム
				el.classList.remove('hidden');
				el.classList.add(appearClass);

			} else if (position && direction === 'left') {

				// 左に移動
				switch (position) {
					case 'right' : el.classList.add(position + '-to-center'); break;
					case 'center' : el.classList.add(position + '-to-left'); break;
					case 'left' : el.classList.add(position + '-to-outerleft'); break;
					case 'outerleft' : el.classList.add('hidden'); break;
				}

			} else if (position && direction === 'right') {

				// 右に移動
				switch (position) {
					case 'left' : el.classList.add(position + '-to-center'); break;
					case 'center' : el.classList.add(position + '-to-right'); break;
					case 'right' : el.classList.add(position + '-to-outerright'); break;
					case 'outerright' : el.classList.add('hidden'); break;
				}

			}
		});
	}

	// 自動でうごく
	(function() {

		var hoverFlag = false;
		$('.h4p_topic-comment').hover(function() {
			hoverFlag = true;
		}, function() {
			hoverFlag = false;
		});

		(function autoMove() {
			if (!hoverFlag && $('.h4p_topic-comment>div').length > 0) {
				moveCommentList('left');
			}
			setTimeout(autoMove, 4000);
		})();

	})();

	// フィルター
	var $fil = $('<a>').addClass('btn btn-lg').css('color', 'rgb(255,255,255)').css({
		'border-top': '16px solid white',
		'border-bottom': '16px solid white',
		'border-left': '0px solid white',
		'border-right': '0px solid white',
		'min-height': '100px',
		'box-shadow': '0 0 6px 1px rgba(0,0,0,0.2) inset'
	});

	$fil.hover(function() {
		$(this).css({
			'border-top': '10px solid white',
			'border-bottom': '10px solid white'
		});
	}, function() {
		$(this).css({
			'border-top': '16px solid white',
			'border-bottom': '16px solid white'
		});
	});

	$.post('../stage/getaglist.php', {
		'attendance-token' : sessionStorage.getItem('attendance-token')
	} , function(data, textStatus, xhr) {
		switch (data) {
			case '':
			case 'parse-error':
				$('.h4p_filtering-buttons').append('Sorry, But load failed // よみこみに しっぱいしました ごめんなさい');
				break;
			default:
				var result = JSON.parse(data);

				// さいしょは ALL // すべて
				$('.h4p_filtering-buttons').append(
					$fil.clone(true, true).attr('title', 'ALL // すべて').text('ALL // すべて').addClass('active').css('background-color', 'rgba(100,100,100,0.8)')
				);

				result.values.forEach(function(item) {

					var fil = $fil.clone(true, true);
					fil.attr('title', item.DisplayString).text(item.DisplayString).css({
						'background-color': item.LabelColor
					});

					$(this).append(fil);

				}, $('.h4p_filtering-buttons'));

				$('.h4p_filtering-buttons a:first-child').css('border-left', '16px solid white');
				$('.h4p_filtering-buttons a:last-child').css('border-right', '16px solid white');

				break;
		}
	});

});