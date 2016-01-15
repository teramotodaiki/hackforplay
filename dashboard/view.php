<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width,initial-scale=1.0" />
	<title>HackforPlay</title>
	<?php require_once '../library.php' ?>
</head>
<body>
	<?php require_once '../analyticstracking.php'; ?>
	<?php require_once '../fb-root.php'; ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="../chartjs/Chart.js" type="text/javascript" charset="utf-8"></script>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<!-- Content -->
	<div class="container">
		<div class="row">
			<div class="col-xs-12 h4p_alert"></div>
			<div class="col-xs-12 panel panel-default">
				<div class="panel-body">
					<div class="text-center">
						<img src="" class="img-circle h4p_own-thumbnail">
					</div>
					<div class="text-center">
						<h3><span class="h4p_own-nickname"></span>のダッシュボード</h3>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-6 panel panel-default">
				<h3 class="text-center">セッション時間　[時間]</h3>
				<div class="panel-body">
					<canvas id="sessiontime" class="width-fit"></canvas>
				</div>
			</div>
			<div class="col-xs-12 col-sm-6 panel panel-default">
				<h3 class="text-center">プロジェクト数　[個]</h3>
				<div class="panel-body">
					<canvas id="projectnum" class="width-fit"></canvas>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
