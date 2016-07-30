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
	<link rel="stylesheet" href="//cdn.jsdelivr.net/emojione/2.2.5/assets/css/emojione.min.css"/>
	<style media="screen">
	.flex-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		width: 100%;
	}
	.flex-container>a {
		position: relative;
		width: 300px;
		height: 200px;
		padding: 50px 100px;
		border-radius: 50%;
		border: 12px solid transparent;
		text-align: center;
		color: rgba(0, 0, 0, 0.2);
		transition: padding 0.15s linear, border 0.4s linear;
	}
	.flex-container>a:hover {
		padding: 0;
		border-radius: 10px;
		border-width: 0;
		color: rgba(260, 260, 260, 1.0);
	}
	</style>
</head>
<body>
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="//cdn.jsdelivr.net/emojione/2.2.5/lib/js/emojione.min.js"></script>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<script src="../s/getStage.js" type="text/javascript" charset="utf-8"></script>
	<div class="container">
		<div class="panel panel-default">
			<div class="panel-body text-center">
				<h3><ruby><rb>検索機能</rb><rt>けんさくきのう</rt></ruby>をためす</h3>
				<form class="h4p_search-stage" method="get">
					<div class="input-group input-group-lg">
			      <input type="text" class="form-control" placeholder="タイトルをここに入力">
			      <span class="input-group-btn">
			        <button class="btn btn-default" type="submit">
								<span class="glyphicon glyphicon-search"></span>
							</button>
			      </span>
			    </div>
				</form>
				<span class="text-muted">ステージのタイトルで検索できるよ</span>
			</div>
		</div>
	</div>

	<?php if (isset($session_userid)): ?>
	<div class="h4p_topic-comment overflow-hidden hidden-xs"></div>
	<?php endif; ?>

	<!-- Pager -->
	<nav class="text-center">
	  <ul class="pagination"></ul>
		<div class="">
			<a class="btn btn-default h4p_filter-clearable">クリア率0%を表示</a>
		</div>
	</nav>

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

	<!-- Pager -->
	<nav class="text-center">
	  <ul class="pagination"></ul>
	</nav>

	<?php require_once '../view/footer.php' ?>
	<?php include_once '../intercom.php'; ?>
</body>
</html>
