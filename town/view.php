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
	<script type="text/javascript">
	var town = $.parseJSON('<?php echo json_encode($town); ?>');
	</script>
	<div class="container container-town">
		<div class="row">
			<div class="town-parent">
				<img class="town-content content-image content-ground">
				<div class="town-content content-button content-parent content-pavilion-0 hidden" data-query="pavilion">
					<img class="town-content content-image content-icon">
					<img class="town-content content-image content-achievement-frame hidden">
					<span class="town-content content-text content-achievement-text hidden"></span>
					<img class="town-content content-image content-locked-frame hidden">
					<span class="town-content content-text content-locked-text hidden"></span>
				</div>
				<div class="town-content content-button content-parent content-pavilion-1 hidden" data-query="pavilion">
					<img class="town-content content-image content-icon">
					<img class="town-content content-image content-achievement-frame hidden">
					<span class="town-content content-text content-achievement-text hidden"></span>
					<img class="town-content content-image content-locked-frame hidden">
					<span class="town-content content-text content-locked-text hidden"></span>
				</div>
				<div class="town-content content-button content-parent content-pavilion-2 hidden" data-query="pavilion">
					<img class="town-content content-image content-icon">
					<img class="town-content content-image content-achievement-frame hidden">
					<span class="town-content content-text content-achievement-text hidden"></span>
					<img class="town-content content-image content-locked-frame hidden">
					<span class="town-content content-text content-locked-text hidden"></span>
				</div>
				<div class="town-content content-button content-parent content-pavilion-3 hidden" data-query="pavilion">
					<img class="town-content content-image content-icon">
					<img class="town-content content-image content-achievement-frame hidden">
					<span class="town-content content-text content-achievement-text hidden"></span>
					<img class="town-content content-image content-locked-frame hidden">
					<span class="town-content content-text content-locked-text hidden"></span>
				</div>
				<div class="town-content content-button content-parent content-restage hidden" data-query="project">
					<img class="town-content content-image content-restage-frame">
					<img class="town-content content-image content-restage-thumbnail">
				</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>