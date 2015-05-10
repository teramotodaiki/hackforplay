function createTopicView () {
	// トピックのビューを生成
	var view = $('<div>').addClass('row panel panel-default');
	view.append(
		$('<div>').addClass('col-md-12 panel-heading').html('<h3>オリジナルステージを作る</h3>')
	).append(
		$('<div>').addClass('col-md-12 panel-body').append(
			$('<div>').addClass('row').append(
				$('<div>').addClass('col-lg-3 col-md-4 col-sm-4 col-xs-12').append(
					$('a').attr({
						'href': '/s?id=201',
						'title': 'ステージをつくろう１',
						'target': '_blank'
					}).append(
						$('<div>').addClass('h4p_item-thumbnail').css({
							'heigh': '160px',
							'background-image': 'url(/s/replay_t1/thumb.png)'
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
						$('<p>').text('おめでとう！君はプログラミングの世界に足を踏み出した！')
					).append(
						$('<a>').addClass('btn btn-success btn-block btn-lg').attr({
							'href': '/s?id=201',
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
	);
	return view.get(0);
}