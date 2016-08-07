$(function(){

	// フィルタ
	var params = getCurrentParams();

	$('.h4p_filter-clearable')
	.addClass(params.show_zero ? 'active' : '')
	.attr('href', getUrl({ show_zero: +!params.show_zero }));

	$('.h4p_search-stage input').val(params.q);

	if (location.search === '' && localStorage.getItem('cached-stages') !== null) {

		var cache = JSON.parse(localStorage.getItem('cached-stages'));
		var data = Object.keys(cache).map(function (key) { return cache[key]; });
	 	// キャッシュ取得
		var result = {
			cache: true,
			data: data,
		};
		renderStaegs(result);
		
		$('.h4p_filter-clearable').remove();

	} else {

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
		.done(renderStaegs)
		.fail(function (xhr) {
			console.error(xhr);
		});

	}

	// サイズ調整 ロード時とリサイズ時
	alignmentOnResize();
	var resized_timeout_id = null;
	$(window).on('resize', function() {
		clearTimeout(resized_timeout_id);
		resized_timeout_id = setTimeout(alignmentOnResize, 100);
	});

	// Signin invitation
	$('.signin-invitation').append(
		$('<h5>').append(
			'Want to make own game?'
		).append(
			$('<span>').addClass('text-muted').text(' // オリジナルステージつくっちゃう？')
		)
	).append(
		$('<img>').attr('src', 'https://embed.hackforplay.xyz/hackforplay/img/restaging_image.png').css({
			width: '100%',
			height: '100%',
		})
	).append(
		$('<a>').attr('href', '/register')
		.addClass('btn btn-link btn-lg btn-block')
		.text('まずはクリエイターズライセンスをゲットしよう！')
	).append(
		$('<p>').addClass('text-muted').append(
			$('<span>').addClass('glyphicon glyphicon-pencil')
		).append(
			'ペンとメモを よういしてください'
		)
	);

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
				location.href = '/s?id=' + $(this).data('stageid');
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

	$('form.h4p_search-stage').on('submit', function (event) {
		event.preventDefault();

		var q = $(this).find('input').val();
		location.href = getUrl({ q: q });
	});

});
