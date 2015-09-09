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
	<script src="view.js" type="text/javascript"></script>
	<script type="text/javascript" charset="utf-8">
	var result = JSON.parse('<?php echo $result_json; ?>');
	</script>
	<?php include '../view/header.php'; ?>
	<div class="modal fade" id="questModal" tabindex="-1" role="dialog" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
			    <div class="modal-body">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <div class="row">
			        </div>
			    </div>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<h1>A pavilion</h1>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<!-- Sample Item -->
			<div class="col-xs-12 col-sm-4 quest-item-sample hidden">
				<p class="item-ID"></p>
				<img alt="" class="img-responsive item-QuestThumbnail">
				<a href="#" class="btn btn-link btn-block item-Modal" data-toggle="modal" data-target="#questModal">
					Modal
				</a>
			</div>
		</div>
	</div>

	<?php require_once '../view/footer.php' ?>
</body>
</html>