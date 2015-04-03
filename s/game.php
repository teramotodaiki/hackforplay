<?php
// Play game
$token = filter_input(INPUT_GET, "token");
$path = filter_input(INPUT_GET, "path");
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
		<script type="text/javascript">
		var __H4PENV__TOKEN     = "<?php echo $token; ?>";
		var __H4PENV__PATH      = "<?php echo $path; ?>";
		var __H4PENV__NEXT		= "<?php echo $next; ?>";
		var __H4PENV__MODE		= "<?php echo $mode; ?>";
		function saveImage(){
			var canvas = $("#enchant-stage>div").children('canvas').get(0);
			var data = canvas.toDataURL();
			sessionStorage.setItem('image', data);
            window.parent.postMessage('thumbnail', '/');
		}
		function screenShot(){
			window.parent.postMessage('screenshot', '/');
			saveImage();
		}
		</script>
		<script src="/s/lib/jquery-1.11.1.min.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/lib/enchant.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/lib/h4p2.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/lib/getEditor.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/lib/setEval.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/lib/textarea.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/lib/rmap.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/lib/overlay.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/lib/clear.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/lib/restagingplay.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/<?php echo $path; ?>main.js" type="text/javascript" charset="utf-8"></script>
		<script src="/s/<?php echo $path; ?>mapdata.js" type="text/javascript" charset="utf-8"></script>
		<style type="text/css">
			body { margin: 0; background-color: black; }
			iframe { border: 0; }
		</style>
	</head>
	<body>
	</body>
</html>