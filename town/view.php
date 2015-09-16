<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>RePlay - hackforplay</title>
	<?php require_once '../library.php' ?>
	<link rel="stylesheet" type="text/css" href="../css/town.css">
</head>
<body class="">
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="view.js" type="text/javascript"></script>
	<div class="container container-town">
		<div class="row">
			<div class="town-parent">
				<img class="town-content content-image content-ground">
				<img class="town-content content-button content-pavilion content-pavilion-0">
				<img class="town-content content-button content-pavilion content-pavilion-1">
				<img class="town-content content-button content-pavilion content-pavilion-2">
				<img class="town-content content-button content-pavilion content-pavilion-3">
				<img class="town-content content-button content-restage-frame">
				<img class="town-content content-button content-restage-thumbnail">
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>