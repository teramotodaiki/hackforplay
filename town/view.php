<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>RePlay - hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class="">
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="view.js" type="text/javascript"></script>
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<h1>Town</h1>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-xs-12 col-sm-6 padding-all-sm">
				<a href="../s/?id=201" title="RPG">
					RPG
				</a>
			</div>
			<div class="col-xs-12 col-sm-6 padding-all-sm">
				<a href="../s/?id=306" title="Action Puzzle">
					Action Puzzle
				</a>
			</div>
			<div class="col-xs-12 col-sm-6 padding-all-sm">
				<a href="../s/?id=307" title="The Survive">
					The Survive
				</a>
			</div>
			<div class="col-xs-12 col-sm-6 padding-all-sm">
				<a href="../s/?id=305" title="Run Game">
					Run Game
				</a>
			</div>
		</div>
	</div>

	<?php require_once '../view/footer.php' ?>
</body>
</html>