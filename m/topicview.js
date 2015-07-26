function createTopicView () {
	// トピックのビューを生成
	var $div = $('<div>').addClass('col-xs-12 panel panel-default').append(
		$('<div>').addClass('panel-heading').html('<h3>オリジナルステージを作る</h3>')
	).append(
		$('<div>').addClass('panel-body').append(
			$('<div>').addClass('row').append(
				$('<div>').addClass('col-lg-3 col-md-4 col-sm-4 col-xs-12').append(
					$('<a>').attr({
						'href': '../replay/',
						'title': 'HackforPlay RePlay',
						'target': '_blank'
					}).append(
						$('<img>').addClass('img-responsive gif-loop-animation').attr({
							'src': '../replay/thumbs/rpg-animation.gif'
						}).css({
							'height': '160px'
						})
					)
				).append(
					$('<div>').addClass('h4p_item-title').html('<h4>ステージをつくろう１</h4>')
				).append(
					$('<div>').addClass('h4p_item-footer').html('<span>会員登録が必要です</span>')
				)
			).append(
				$('<div>').addClass('col-lg-offset-1 col-lg-7 col-md-8 col-sm-8 col-xs-12 h4p_topicitem').append(
					$('<div>').addClass('h4p_item-title').html('<h4>ここからが、真のハックフォープレイだ！</h4>')
				).append(
					$('<div>').append(
						$('<p>').text('おめでとう！君はプログラミングの世界に足を踏み出した！')
					).append(
						$('<p>').text('このまま勉強を続ければ...自分でゲームを作ることだって、夢ではない!!')
					).append(
						$('<a>').addClass('btn btn-success btn-block btn-lg').attr({
							'href': '../replay/',
							'title': '今すぐ始める'
						}).css({
							'margin-top': '10px',
							'margin-bottom': '10px'
						}).html('<h3>今すぐ始める</h3>')
					)
				).append(
					$('<div>').addClass('h4p_item-footer').append(
						$('<p>').html('対象年齢の目安：<b>10才以上</b>')
					).append(
						$('<p>').text('キーボードの全角/半角と、簡単な英単語の知識が必要です。')
					)
				)
			)
		)
	).get(0);

	// トピック
	var images_index = 0;
	var images = ['../replay/thumbs/rpg-animation.gif', '../replay/thumbs/rungame-animation.gif', '../replay/thumbs/thesurvive-animation.gif', '../replay/thumbs/puzzleaction-animation.gif'];
	setInterval(function() {
		images_index = (images_index + 1) % images.length;
		$('.container .gif-loop-animation').attr('src', images[images_index]);
	}, 4000);

	return $div;
}