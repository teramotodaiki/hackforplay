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
	<?php require_once '../externalcodes.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="view.js" type="text/javascript"></script>
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<div class="panel panel-default">
					<div class="panel-body">
						<img src="replay_logo.png" class="margin-right-lg" style="height: 42px" alt="">
						<span class="text-muted">ステージを つくってあそぶ</span>
					</div>
					<div class="panel-footer">
						<p>
							まずは すきなステージを えらんで ゲームをあそんでみよう！
							<button type="button" class="btn btn-success">改造する</button> を おすと じぶんでも ステージを つくれるぞ
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-xs-12 col-sm-6 padding-all-sm">
				<a href="../s/?id=201" title="RPG">
					<img src="thumbs/rpg-animation.gif" class="img-rounded width-fit" alt="">
				</a>
			</div>
			<div class="col-xs-12 col-sm-6 padding-all-sm">
				<a href="../s/?id=306" title="Action Puzzle">
					<img src="thumbs/puzzleaction-animation.gif" class="img-rounded width-fit" alt="">
				</a>
			</div>
			<div class="col-xs-12 col-sm-6 padding-all-sm">
				<a href="../s/?id=307" title="The Survive">
					<img src="thumbs/thesurvive-animation.gif" class="img-rounded width-fit" alt="">
				</a>
			</div>
			<div class="col-xs-12 col-sm-6 padding-all-sm">
				<a href="../s/?id=305" title="Run Game">
					<img src="thumbs/rungame-animation.gif" class="img-rounded width-fit" alt="">
				</a>
			</div>
		</div>
	</div>

	<?php require_once '../view/footer.php' ?>
</body>
</html>