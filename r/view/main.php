<!-- HTML -->
<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>あそべるプログラミング hackforplay</title>
	<?php require_once '../library.php' ?>
	<!-- Open graph protocol -->
	<meta property="og:title" content="あそべるプログラミング HackforPlay"/>
	<meta property="og:description" content="プログラミングをゲームで学ぼう。小中学生向けの教育ゲーム ハックフォープレイ"/>
	<meta property="og:image" content="http://hackforplay.xyz/img/ogimg.jpg"/>
	<meta property="og:url" content="http://hackforplay.xyz"/>
	<meta property="og:type" content="game"/>
	<meta property="og:site_name" content="あそべるプログラミング HackforPlay"/>
</head>
<body class="">
	<script type="text/javascript" charset="utf-8">
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
		});
	});
	</script>
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<div class="row h4p_box">
					<div class="col-md-12 h4p_box-header">
						<h3>オリジナルステージを作る</h3>
					</div>
					<div class="col-md-12 h4p_box-main">
						<div class="row">
							<a href="/s?id=201" title="ステージをつくろう１" target="_blank">
								<div class="col-md-4 col-xs-4 h4p_topicitem">
									<div class="h4p_item-thumbnail">
										<span class="h4p_item-src">/s/replay_t1/thumb.png</span>
									</div>
									<div class="h4p_item-title">
										<h4>ステージをつくろう１</h4>
									</div>
									<div class="h4p_item-footer">
										<span>会員登録が必要です</span>
									</div>
								</div>
							</a>
							<div class="col-md-8 col-xs-8 h4p_topicitem">
								<div class="h4p_item-title">
									<h4>ここからが、真のハックフォープレイだ！</h4>
								</div>
								<div>
									おめでとう！君はプログラミングの世界に足を踏み出した！<br>
									このまま勉強を続ければ...自分でゲームを作ることだって、夢ではない!!<br>
									<a href="/s?id=201" class="btn btn-success btn-block btn-lg" title="今すぐ始める" style="margin-top: 10px; margin-bottom: 10px;"><h3>今すぐ始める</h3></a>
								</div>
								<div class="h4p_item-footer">
									対象年齢の目安：<b>10才以上</b><br>
									キーボードの全角/半角と、簡単な英単語の知識が必要です。
								</div>
							</div>
						</div>
					</div>
				</div>
	  		</div>
			<div class="col-md-12">
				<div class="row h4p_box">
					<div class="col-md-12 h4p_box-header">
						<h3>投稿されたステージ一覧</h3>
					</div>
					<div class="col-md-12 h4p_box-main">
						<div id="h4p_stagelist" class="row">
						</div>
					</div>
					<div class="col-md-12 h4p_box-footer">
					</div>
				</div>
			</div>
			<div class="col-md-12">
				<div class="row h4p_box">
					<div class="col-md-12 h4p_box-header">
						<h3>空のステージ</h3>
					</div>
					<div class="col-md-12 h4p_box-main">
						<div id="h4p_emptylist" class="row">
							<!-- stages list with PHP -->
							<?php
							// [[id1, size1], [id2, size2] ... ]
							$more_stage_list = array(
								array(1001,4), array(1002,4)
							);
							foreach ($more_stage_list as $key => $value) {
								$item = $allstages[$value[0]];
								$size = $value[1];
								include 'item.php';
							}
							?>
						</div>
					</div>
				</div>
	  		</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>