<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<title><?php echo $title; ?> - hackforplay</title>
	</head>
	<body style="margin: 0; background-color: #000;">
		<script type="text/javascript" charset="utf-8">
		var __H4PENV__MODE		= sessionStorage.getItem('stage_param_game_mode');
		</script>
		<script src="lib/enchant.js" type="text/javascript" charset="utf-8"></script>
		<script src="lib/ui.enchant.js" type="text/javascript" charset="utf-8"></script>
		<script src="lib/hack.js" type="text/javascript" charset="utf-8"></script>

		<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js" type="text/javascript" charset="utf-8"></script>

		<script src="kit/STG/canvas.js" type="text/javascript" charset="utf-8"></script>

		<script src="kit/STG/forward.js" type="text/javascript" charset="utf-8"></script>

		<script src="kit/STG/math.js" type="text/javascript" charset="utf-8"></script>


		<script src="kit/STG/particle.js" type="text/javascript" charset="utf-8"></script>

		<script src="kit/STG/shot.js" type="text/javascript" charset="utf-8"></script>
		<script src="kit/STG/barrage.js" type="text/javascript" charset="utf-8"></script>
		<script src="kit/STG/spell.js" type="text/javascript" charset="utf-8"></script>

		<script src="kit/STG/new-easy-timeline.js" type="text/javascript" charset="utf-8"></script>
		<script src="kit/STG/motion.js" type="text/javascript" charset="utf-8"></script>

		<script src="kit/STG/character.js" type="text/javascript" charset="utf-8"></script>
		<script src="kit/STG/enemy.js" type="text/javascript" charset="utf-8"></script>
		<script src="kit/STG/player.js" type="text/javascript" charset="utf-8"></script>


		<script src="kit/STG/boss.js" type="text/javascript" charset="utf-8"></script>

		<script src="kit/STG/stage.js" type="text/javascript" charset="utf-8"></script>


		<script src="kit/STG/_test.js" type="text/javascript" charset="utf-8"></script>

		<script src="kit/STG/main.js" type="text/javascript" charset="utf-8"></script>


		<style type="text/css">
			textarea.log {
				color: #fff;
				font: bold large sans-serif;
				border: 3px solid #fff;
				border-radius: 10px;
				padding: 10px;
				margin: 3px;
			}
			#debug {
				position: absolute;
				width: 30%;
				height: 30%;
				top: 70%;
				left: 70%;
				box-sizing: border-box;
				border: none;
				resize: none;
				background: rgba(0, 0, 0, .8);
				color: #0f0;
				font-size: 1.2rem;
			}
		</style>

		<textarea id="debug" readonly />
	</body>
</html>