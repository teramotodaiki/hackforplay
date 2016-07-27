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
				$('<p>').append(
					$('<span>').addClass('playcount').html('プレイ回数：<b>回</b>')
				).append(
					$('<span>').addClass('clearrate label label-sm').text('0%')
				)
			).append(
				$('<p>').append($('<span>').addClass('emoji').css('font-size', '90%'))
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

	// フィルタ
	var params = getCurrentParams();

	$('.h4p_filter-clearable')
	.addClass(params.show_zero ? 'active' : '')
	.attr('href', getUrl({ show_zero: +!params.show_zero }));

	$('.h4p_search-stage input').val(params.q);

	// 一覧取得（New API）
	$.ajax({
		type: 'GET',
		url: '/api/stages',
		data: {
			is_clearable: params.show_zero ? null : 1,
			page: params.page,
			q: params.q,
		}
	})
	.done(function (result) {
		var $list = $('.h4p_stagelist.list-stage');

		// pager
		$('.pagination').append(
			$('<li>').addClass('page-item ' + (result.prev_page_url ? '' : ' disabled')).append(
				$('<a>').addClass('page-link').attr({
					href: getUrl({ page: result.current_page - 1 }),
					'aria-label': 'Previous'
				}).append(
					$('<span>').attr('aria-hidden', 'true').addClass('glyphicon glyphicon-chevron-left')
				)
			)
		);
		for (var page = Math.max(1, result.current_page - 4);
		 			page <= Math.min(result.last_page, result.current_page + 4);
					page++) {
			$('.pagination').append(
				$('<li>').addClass('page-item' + (page === result.current_page ? ' active' : '')).append(
					$('<a>').addClass('page-link').attr('href', getUrl({ page: page })).text(page)
				)
			)
		}
		$('.pagination').append(
			$('<li>').addClass('page-item' + (result.next_page_url ? '' : ' disabled')).append(
				$('<a>').addClass('page-link').attr({
					href: getUrl({ page: result.current_page + 1 }),
					'aria-label': 'Next'
				}).append(
					$('<span>').attr('aria-hidden', 'true').addClass('glyphicon glyphicon-chevron-right')
				)
			)
		);

		result.data.forEach(function(stage){
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
			if (stage.user) {
				item.find('.author a').attr({
					href: '/m?id=' + stage.user.id,
					title: stage.user.nickname
				}).text(stage.user.nickname);
			}else{
				item.find('.author').text('いにしえのプログラマー');
			}
			item.find('.playcount b').prepend(stage.playcount);
			var rate = stage.clearcount / stage.playcount;
			item.find('.clearrate').text(
				'クリア率 ' + (rate * 100 >> 0) + '%'
			).addClass(rateToLabelColor(rate, stage.playcount == 0));

			// emoji summary
			$.ajax({
				type: 'GET',
				url: `/api/stages/${stage.id}/emojis`,
				data: {
					summary: 1,
				},
			})
			.done(function (result) {
				item.find('.emoji').children().remove();
				Object.keys(result).forEach(function (key) {
					item.find('.emoji').append(
						$('<span>').css('margin-right', '.7rem').append(
							$(emojione.shortnameToImage(`:${key}:`))
						).append(' ' + result[key])
					);
				});
			});

			item.appendTo($list);
		});
		alignmentOnResize();
	})
	.fail(function (xhr) {
		console.error(xhr);
	});


	// 空のステージ一覧
	$.post('../stage/fetchbyid.php',{
		'id': '1,1755',
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
			// [左バー | 中身 | 右バー]の幅 >= containerの幅 ---> はみだすので非表示に
			var entity = $con.find('.h4p_bar-left').width() + $con.find('.h4p_stagelist').width() + $con.find('.h4p_bar-right').width();
			if (entity < $con.width()) {

				// 左右バー表示（高さをentityにあわせる）
				var containerHeight = $con.find('.h4p_stagelist').height();
				$con.find('.h4p_bar-left,.h4p_bar-right').removeClass('hidden').height(containerHeight);

			} else {

				// 左右バー非表示
				$con.find('.h4p_bar-left,.h4p_bar-right').addClass('hidden');

			}

		});
	}

	// コメント
	var $com =
	$('<div>').css('cursor', 'pointer').append(
		$('<div>').addClass('panel panel-default').append(
			$('<div>').addClass('panel-body row').append(
				$('<div>').addClass('col-sm-6').append(
					$('<div>').addClass('row').append(
						$('<div>').addClass('col-sm-4 col-md-2 comment-header visible-sm').append(
							$('<img>').addClass('img-circle comment-item-padding')
						)
					).append(
						$('<div>').addClass('col-sm-8 col-md-10 comment-header visible-sm').append(
							$('<div>').addClass('text-muted comment-item-padding nickname')
						).append(
							$('<div>').addClass('comment-item-padding hashtag')
						)
					).append(
						$('<div>').addClass('col-sm-12 comment-thumbnail').append(
							$('<img>').addClass('h4p_thumbnail img-responsive')
						)
					)
				)
			).append(
				$('<div>').addClass('col-sm-6').append(
					$('<div>').addClass('row').append(
						$('<div>').addClass('col-sm-4 col-md-2 comment-header hidden-sm').append(
							$('<img>').addClass('img-circle comment-item-padding')
						)
					).append(
						$('<div>').addClass('col-sm-8 col-md-10 comment-header hidden-sm').append(
							$('<div>').addClass('text-muted comment-item-padding nickname')
						).append(
							$('<div>').addClass('comment-item-padding hashtag')
						)
					).append(
						$('<div>').addClass('col-sm-12 comment-body overflow-auto')
					).append(
						$('<div>').addClass('col-sm-12 comment-footer').append(
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

	// append ===>
	if ($('.h4p_topic-comment').get(0)) {


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
					var rate = item.LogCount.Cleared / item.LogCount.All;
					com.find('.comment-footer p').text(
						'クリア率 ' + (rate * 100 >> 0) + '%'
					).addClass(rateToLabelColor(rate, item.LogCount.All == 0));

					$(this).append(com);
				}, $('.h4p_topic-comment'));
		}
	});

	}
	// <=== append
	

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

	// トピック
	var images_index = 0;
	var images = ['../replay/thumbs/rpg-animation.gif', '../replay/thumbs/rungame-animation.gif', '../replay/thumbs/thesurvive-animation.gif', '../replay/thumbs/puzzleaction-animation.gif'];
	setInterval(function() {
		images_index = (images_index + 1) % images.length;
		$('.container .gif-loop-animation').attr('src', images[images_index]);
	}, 4000);

	function rateToLabelColor (rate, isZero) {
		return isZero ? 'label-default' :
		rate < 0.15 ? 'label-hard' :
		rate < 0.3 ? 'label-normal' :
		'label-easy';
	}

	$('form.h4p_search-stage').on('submit', function (event) {
		event.preventDefault();

		var q = $(this).find('input').val();
		location.href = getUrl({ q: q });
	});

	function urlParam(name, _default) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return _default || null;
    }
    else{
       return results[1] || 0;
    }
	}

	function getCurrentParams () {
		return {
			page: +urlParam('page', 1),
			show_zero: +urlParam('show_zero', 0),
			q: decodeURIComponent(urlParam('q') || ''),
		};
	}

	function getUrl (params) {
		var merged = $.extend(getCurrentParams(), params);

		var query = Object.keys(merged).filter(function (key) {
			return merged[key] !== null && merged[key] !== '';
		}).map(function (key) {
			return key + '=' + merged[key];
		}).join('&');

		return location.pathname + '?' + query;
	}

});
