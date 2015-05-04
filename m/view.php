<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
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
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<div class="row h4p_box">
					<div class="col-md-12 h4p_box-header">
						<h3>あなたのステージ</h3>
					</div>
					<div class="col-md-12 h4p_box-main">
						<div id="h4p_stagelist" class="row">
						</div>
					</div>
					<div class="col-md-12 h4p_box-footer">
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>