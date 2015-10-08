<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>HackforPlay</title>
	<?php require_once '../library.php' ?>
</head>
<body>
	<?php require_once '../externalcodes.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<!-- Content -->
	<div class="container">
		<div class="row">
			<div class="col-xs-offset-1 col-xs-10">
				<div class="row panel panel-default">
					<div class="panel-heading">
						<h4>あなたへのメッセージ</h4>
					</div>
					<div class="h4p_comment-list"></div>
					<div class="panel-footer text-center">
						<button type="button" class="btn btn-link h4p_load-more-comment" data-loding-text="Loading...">More // もっと ひょうじ</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php'; ?>
</body>
</html>






