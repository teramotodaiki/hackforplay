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
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
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
									<div class="h4p_item-thumbnail" style="height: 160px; background-image:url(/s/replay_t1/thumb.png)">
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
						</div>
					</div>
				</div>
	  		</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>