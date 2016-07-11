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
	<div class="h4p_topic-comment overflow-hidden hidden-xs">
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
	<?php include_once '../intercom.php'; ?>
</body>
</html>
