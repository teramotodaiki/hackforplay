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
				<div class="town-content content-parent content-background timeline timeline-3s">
					<img class="town-content content-image content-cloud content-cloud-1">
					<img class="town-content content-image content-cloud content-cloud-2">
					<img class="town-content content-image content-cloud content-cloud-3">
					<img class="town-content content-image content-cloud content-cloud-1">
					<img class="town-content content-image content-cloud content-cloud-2">
					<img class="town-content content-image content-cloud content-cloud-3">
				</div>
				<img class="town-content content-image timeline timeline-1s content-ground">
				<div class="town-content content-button content-parent content-pavilion content-pavilion-0 hidden" data-query="pavilion">
					<img class="town-content content-image timeline timeline-2s content-icon">
					<img class="town-content content-image timeline timeline-2s content-achievement-frame hidden">
					<span class="town-content content-text timeline timeline-2s content-achievement-text hidden"></span>
					<img class="town-content content-image timeline timeline-2s content-locked-frame hidden">
					<span class="town-content content-text timeline timeline-2s content-locked-text hidden"></span>
				</div>
				<div class="town-content content-button content-parent content-pavilion content-pavilion-1 hidden" data-query="pavilion">
					<img class="town-content content-image timeline timeline-2s content-icon">
					<img class="town-content content-image timeline timeline-2s content-achievement-frame hidden">
					<span class="town-content content-text timeline timeline-2s content-achievement-text hidden"></span>
					<img class="town-content content-image timeline timeline-2s content-locked-frame hidden">
					<span class="town-content content-text timeline timeline-2s content-locked-text hidden"></span>
				</div>
				<div class="town-content content-button content-parent content-pavilion content-pavilion-2 hidden" data-query="pavilion">
					<img class="town-content content-image timeline timeline-2s content-icon">
					<img class="town-content content-image timeline timeline-2s content-achievement-frame hidden">
					<span class="town-content content-text timeline timeline-2s content-achievement-text hidden"></span>
					<img class="town-content content-image timeline timeline-2s content-locked-frame hidden">
					<span class="town-content content-text timeline timeline-2s content-locked-text hidden"></span>
				</div>
				<div class="town-content content-button content-parent content-pavilion content-pavilion-3 hidden" data-query="pavilion">
					<img class="town-content content-image timeline timeline-2s content-icon">
					<img class="town-content content-image timeline timeline-2s content-achievement-frame hidden">
					<span class="town-content content-text timeline timeline-2s content-achievement-text hidden"></span>
					<img class="town-content content-image timeline timeline-2s content-locked-frame hidden">
					<span class="town-content content-text timeline timeline-2s content-locked-text hidden"></span>
				</div>
				<div class="town-content content-button content-parent content-restage hidden" data-query="project">
					<img class="town-content content-image timeline timeline-2s content-restage-frame">
					<img class="town-content content-image timeline timeline-2s content-restage-thumbnail">
				</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
	<?php include_once '../intercom.php'; ?>
</body>
</html>
