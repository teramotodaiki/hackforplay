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
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<!-- Content -->
	<div class="container">
		<div class="row">
			<div class="col-xs-12 h4p_alert"></div>
			<div class="col-xs-12">
				<div class="panel-body">
					<div class="text-center">
						<img src="" class="img-circle h4p_own-thumbnail">
					</div>
					<div class="text-center">
						<h3><span class="h4p_own-nickname"></span>のダッシュボード<small class="text-muted">β</small></h3>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-6 col-md-4 item-dashboard">
				<div class="item-dashboard-layer">
					<span class="glyphicon glyphicon-play-circle"></span>
				</div>
				<div class="item-dashboard-layer">
					<span class="item-dashboard-value item-dashboard-playcount">-</span>
				</div>
			</div>
			<div class="col-xs-12 col-sm-6 col-md-4 item-dashboard">
				<div class="item-dashboard-layer">
					<span class="glyphicon glyphicon-wrench"></span>
				</div>
				<div class="item-dashboard-layer">
					<span class="item-dashboard-value item-dashboard-restagecount">-</span>
				</div>
			</div>
		</div>
	</div>
</body>
</html>
