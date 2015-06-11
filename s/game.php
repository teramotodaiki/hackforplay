<?php
// Play game
$token = filter_input(INPUT_GET, "token");
$next = filter_input(INPUT_GET, "next");
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
	<body style="margin: 0; background-color: #fff;">
		<script type="text/javascript" charset="utf-8">
		var __H4PENV__TOKEN     = "<?php echo $token; ?>";
		var __H4PENV__NEXT		= "<?php echo $next; ?>";
		var __H4PENV__MODE		= "<?php echo $mode; ?>";
		</script>
		<script src="/s/lib/enchant.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/lib/hack.js" type="text/javascript" charset="utf-8"></script>
	</body>
</html>