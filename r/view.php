<!-- HTML -->
<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
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
<body>
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script type="text/javascript" charset="utf-8">
	(function(){
		var start = '<?php echo $fetch_start_id; ?>';
		start = isNaN(parseInt(start)) ? '0' : start;
		sessionStorage.setItem('view_param_start', start);
		var num = '<?php echo $stage_num; ?>';
		num = isNaN(parseInt(num)) ? '0' : num;
		sessionStorage.setItem('view_param_num', num);
		var filter = '<?php echo $filter; ?>';
		sessionStorage.setItem('view_param_filter', filter);
	})();
	</script>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<div class="container hidden-xs">
		<div class="row">
			<div class="col-xs-12">
				<div class="row panel panel-default">
					<div class="col-xs-12 panel-heading">
						<h3>オリジナルステージを作る</h3>
					</div>
					<div class="col-xs-12 panel-body">
						<div class="row">
							<div class="col-lg-3 col-md-4 col-sm-4 col-xs-12">
								<a href="/s?id=201" title="ステージをつくろう１" target="_blank">
									<img src="../replay/thumbs/rpg-animation.gif" style="height: 160px" class="img-responsive gif-loop-animation" alt="">
								</a>
								<div class="h4p_item-title">
									<h4>ステージをつくろう１</h4>
								</div>
								<div class="h4p_item-footer">
									<span>会員登録が必要です</span>
								</div>
							</div>
							<div class="col-lg-offset-1 col-lg-7 col-md-8 col-sm-8 col-xs-12 h4p_topicitem">
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
		</div>
	</div>
	<div class="h4p_topic-comment overflow-hidden hidden-xs">
	</div>
	<div id="page_anchor" class="container-fluid" role="group">
		<div class="row">
			<div class="col-sm-12 hidden-xs">
				<div class="h4p_filtering-buttons btn-group btn-group-justified margin-top-lg">
				</div>
			</div>
			<div class="col-xs-12 visible-xs">
				<div class="h4p_filtering-buttons btn-group btn-group-vertical width-fit">
				</div>
			</div>
		</div>
	</div>
	<div class="container-fluid h4p_stagecontainer">
		<div class="row">
			<div class="col-xs-12 h4p_bar-top"></div>
			<div class="col-xs-12 h4p_bar-bar">
				<div class="container">
					<div class="h4p_bar-left"></div>
					<div class="row h4p_stagelist list-stage"></div>
					<div class="h4p_bar-right"></div>
				</div>
			</div>
			<div class="col-xs-12 h4p_bar-bottom"></div>
		</div>
	</div>
	<div class="container-fluid">
		<div class="row">
			<div class="col-xs-4 text-right">
				<a href="javascript:void(0);" title="previous" class="btn btn-lg btn-default go_page_previous">
					前へ
				</a>
			</div>
			<div class="col-xs-4 text-center page-numbers">
			</div>
			<div class="col-xs-4 text-left">
				<a href="javascript:void(0);" title="next" class="btn btn-lg btn-default go_page_next">
					次へ
				</a>
			</div>
		</div>
	</div>
	<div class="container-fluid h4p_stagecontainer">
		<div class="row">
			<div class="col-xs-12 h4p_bar-top"></div>
			<div class="col-xs-12 h4p_bar-bar">
				<div class="container">
					<div class="h4p_bar-left"></div>
					<div class="row h4p_stagelist list-empty"></div>
					<div class="h4p_bar-right"></div>
				</div>
			</div>
			<div class="col-xs-12 h4p_bar-bottom"></div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>