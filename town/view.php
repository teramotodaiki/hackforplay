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
	<script type="text/javascript" charset="utf-8">
	console.log($.parseJSON('<?php echo json_encode($pavilions); ?>'));
	</script>
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<h1>Town</h1>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<h4>所持ダイヤ：<span><?php echo $quest_cleared + $quest_restaged + $kit_restaged; ?></span></h4>
			</div>
			<?php foreach ($pavilions as $key => $value) : ?>
			<div class="col-xs-12 col-sm-6 padding-all-sm">
				<a href="../pavilion/?id=<?php echo $value['ID']; ?>" class="btn btn-lg btn-link <?php if (!$value['Certified']) echo 'disabled'; ?>">
					<?php echo $value['DisplayName']; ?>
				</a>
				<h4>必要なダイヤ：<span><?php echo $value['RequiredAchievements']; ?></span></h4>
			</div>
			<?php endforeach; ?>
		</div>
	</div>

	<?php require_once '../view/footer.php' ?>
</body>
</html>