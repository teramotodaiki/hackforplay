<?php
// Play game
$next = filter_input(INPUT_GET, "next", FILTER_VALIDATE_INT);
$mode = filter_input(INPUT_GET, "mode");
if(!isset($mode)){
	$mode = "official";
}
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="x-ua-compatible" content="IE=Edge">
		<meta name="viewport" content="width=device-width, user-scalable=no">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
		<title><?php echo $title; ?> - hackforplay</title>
	</head>
	<body style="margin: 0; background-color: #000;">
		<script type="text/javascript" charset="utf-8">
		var __H4PENV__MODE		= sessionStorage.getItem('stage_param_game_mode');
		var __H4PENV__NEXT		= "<?php echo $next; ?>";
		</script>
		<script src="lib/enchant.js" type="text/javascript" charset="utf-8"></script>
		<script src="lib/hack.js" type="text/javascript" charset="utf-8"></script>
		<script src="lib/actionpuzzle.js" type="text/javascript" charset="utf-8"></script>
		<style type="text/css">
		textarea.log {
			color: #fff;
			font: bold large sans-serif;
			border: 3px solid #fff;
			border-radius: 10px;
			padding: 10px;
			margin: 3px;
		}
		</style>
	</body>
</html>