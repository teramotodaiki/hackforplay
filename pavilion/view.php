<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>RePlay - hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class=""<?php if (isset($pavilionBg)) : ?>
	style="background-image: url(<?php echo $pavilionBg; ?>)"
<?php endif; ?>>
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<script src="view.js" type="text/javascript"></script>
	<script type="text/javascript" charset="utf-8">
	var result = JSON.parse('<?php echo $pavilion_json; ?>');
	</script>
	<?php include '../view/header.php'; ?>
	<?php include 'modal.php'; ?>
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<h1>A pavilion</h1>
			</div>
			<div class="col-xs-4">
				<input type="image" src="img/jp/btn_type_easy_n.png" alt="やさしい" class="change-type-button" data-type="easy" disabled="disabled" data-psrc="img/jp/btn_type_easy_p.png" data-nsrc="img/jp/btn_type_easy_n.png">
			</div>
			<div class="col-xs-4">
				<input type="image" src="img/jp/btn_type_normal_p.png" alt="ふつう" class="change-type-button" data-type="normal" data-psrc="img/jp/btn_type_normal_p.png" data-nsrc="img/jp/btn_type_normal_n.png">
			</div>
			<div class="col-xs-4">
				<input type="image" src="img/jp/btn_type_hard_p.png" alt="むずかしい" class="change-type-button" data-type="hard" data-psrc="img/jp/btn_type_hard_p.png" data-nsrc="img/jp/btn_type_hard_n.png">
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<!-- Sample Item -->
			<div class="quest-item-sample pull-left hidden">
				<div>
					<img src="" class="achivement achivement-cleared" alt="">
					<img src="" class="achivement achivement-restaged" alt="">
				</div>
				<div>
					<p>クエスト　1 - <span class="Number"></span></p>
				</div>
				<div>
					<p><span class="Challengers"></span>人<ruby>が挑戦<rt>ちょうせん</rt></ruby>し、</p>
					<p><span class="Winners"></span>人がクリアした</p>
				</div>
				<div>
					<p><ruby>主<rt>おも</rt></ruby>なクリエイター</p>
		        	<p class="Authors">...</p>
				</div>
				<div class="stage-frame-wrapper">
					<img alt="" class="stage-thumbnail QuestThumbnail">
					<img src="img/stage_frame.png" class="stage-frame" alt="">
				</div>
				<a href="#" class="btn btn-link btn-block item-Modal" data-toggle="modal" data-target="#questModal">
					Modal
				</a>
			</div>
			<div class="kit-item-sample pull-left hidden">
				<div>
					<img src="" class="achivement achivement-restaged" alt="">
				</div>
				<div>
					<p>オリジナルステージ作成</p>
				</div>
				<div>
					<p>今までに<span class="Restagers"></span>人<ruby>があたらしいステージを作成した
				</div>
				<div>
					<p><span class="Explain"></span></p>
				</div>
				<img alt="" class="img-responsive Thumbnail">
				<a href="#" class="btn btn-link btn-block" data-toggle="modal" data-target="#kitModal">
					Modal
				</a>
			</div>
		</div>
	</div>

	<?php require_once '../view/footer.php' ?>
</body>
</html>