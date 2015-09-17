<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class=""<?php if (isset($pavilionBg)) : ?>
	style="background-image: url(<?php echo $pavilionBg; ?>)"
<?php endif; ?>>
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<script src="view.js" type="text/javascript"></script>
	<script src="randomize.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript" charset="utf-8">
	var result = JSON.parse('<?php echo $pavilion_json; ?>');
	</script>
	<?php include '../view/header.php'; ?>
	<?php include 'modal.php'; ?>
	<div class="container container-pavilion">
		<div class="row">
			<div class="center-block type-button-wrapper">
				<input type="image" src="img/jp/btn_type_easy_n.png" alt="やさしい" class="change-type-button" data-type="easy" disabled="disabled" data-psrc="img/jp/btn_type_easy_p.png" data-nsrc="img/jp/btn_type_easy_n.png" data-number="1">
				<input type="image" src="img/jp/btn_type_normal_p.png" alt="ふつう" class="change-type-button" data-type="normal" data-psrc="img/jp/btn_type_normal_p.png" data-nsrc="img/jp/btn_type_normal_n.png" data-number="2">
				<input type="image" src="img/jp/btn_type_hard_p.png" alt="むずかしい" class="change-type-button" data-type="hard" data-psrc="img/jp/btn_type_hard_p.png" data-nsrc="img/jp/btn_type_hard_n.png" data-number="3">
			</div>
			<!-- Sample Item -->
			<div class="quest-item-sample pull-left animation-hover-expand hidden" data-toggle="modal" data-target="#questModal">
				<div class="item-achievement">
					<img src="" class="achievement achievement-cleared" alt="">
					<img src="" class="achievement achievement-restaged" alt="">
				</div>
				<div class="item-article">
					<div class="item-underscore">
						<p>クエスト　<span class="TypeString"></span> - <span class="Number"></span></p>
					</div>
					<div class="item-underscore">
						<p><span class="Challengers"></span>人<ruby>が挑戦<rt>ちょうせん</rt></ruby>し、</p>
						<p><span class="Winners"></span>人がクリアした</p>
					</div>
					<div>
						<p><ruby>主<rt>おも</rt></ruby>なクリエイター</p>
			        	<p class="Authors text-overflow-ellipsis">...</p>
					</div>
				</div>
				<div class="stage-frame-wrapper">
					<img alt="" class="stage-thumbnail QuestThumbnail">
					<img src="" class="stage-frame" alt="">
				</div>
			</div>
			<div class="kit-item-sample pull-left animation-hover-expand hidden" data-toggle="modal" data-target="#kitModal">
				<div class="item-achievement">
					<img src="" class="achievement achievement-restaged" alt="">
				</div>
				<div class="item-article">
					<div class="item-underscore">
						<p>オリジナルステージ作成</p>
					</div>
					<div class="item-underscore">
						<p>今までに<span class="Makers"></span>人があたらしいステージを作成した
					</div>
					<div>
						<p><span class="Explain"></span></p>
					</div>
				</div>
				<div class="stage-frame-wrapper">
					<img alt="" class="stage-thumbnail Thumbnail">
					<img src="" class="stage-frame" alt="">
				</div>
			</div>
		</div>
	</div>

	<?php require_once '../view/footer.php' ?>
</body>
</html>