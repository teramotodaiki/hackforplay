<?php

$src = '/embed/?type=sta&id=' . $id;

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title><?php echo $stage['Title']; ?> - HackforPlay</title>
	<script type="text/javascript">
	stageInfo = {
		StageID: <?php echo $id; ?>,
		Title: <?php echo $stage['Title']; ?>
		ScriptID: <?php echo $stage['ScriptID']; ?>

	};
	</script>
	<?php require_once '../library.php' ?>
	<!-- HackforPlay RePlay -->
	<script src="../embed/editor/lib/codemirror.js" type="text/javascript"></script>
	<script src="../embed/editor/mode/javascript/javascript.js" type="text/javascript"></script>
	<script src="../embed/editor/addon/edit/matchbrackets.js" type="text/javascript"></script>
	<script src="../embed/editor/addon/edit/closebrackets.js" type="text/javascript"></script>
	<script src="../embed/editor/addon/dialog/dialog.js" type="text/javascript"></script>
	<script src="../embed/editor/addon/search/searchcursor.js" type="text/javascript"></script>
	<script src="../embed/editor/addon/search/search.js" type="text/javascript"></script>
	<script src="../embed/editor/keymap/sublime.js" type="text/javascript"></script>
	<script src="../embed/editor/addon/scroll/simplescrollbars.js" type="text/javascript"></script>
	<script src="../embed/editor/addon/fold/foldcode.js" type="text/javascript"></script>
	<script src="../embed/editor/addon/fold/foldgutter.js" type="text/javascript"></script>
	<script src="../embed/editor/addon/fold/brace-fold.js" type="text/javascript"></script>
	<script src="../embed/editor/addon/comment/comment.js" type="text/javascript"></script>
	<link rel="stylesheet" href="../embed/editor/lib/codemirror.css">
	<link rel="stylesheet" href="../embed/editor/addon/dialog/dialog.css">
	<link rel="stylesheet" href="../embed/editor/addon/scroll/simplescrollbars.css">
	<link rel="stylesheet" href="../embed/editor/addon/fold/foldgutter.css">
	<link rel="stylesheet" href="../css/cmcolor.css">
	<style type="text/css" media="screen">
		.CodeMirror {
			top: 0px;
			left: 0px;
			background-color: rgb(245,245,245);
			line-height: 1.2;
		}
		.CodeMirror-dialog.CodeMirror-dialog-top {
			/* box-shadow */
			box-shadow:rgba(0, 0, 0, 0.65098) 0px 0px 8px -1px;
			-webkit-box-shadow:rgba(0, 0, 0, 0.65098) 0px 0px 8px -1px;
			-moz-box-shadow:rgba(0, 0, 0, 0.65098) 0px 0px 8px -1px;
		}
		div.CodeMirror span.CodeMirror-matchingbracket {
			color: #000;
			border-bottom: 1px solid black;
		}
		.CodeMirror-foldgutter-open:after {
			color: blue;
			text-shadow: #b9f 1px 1px 2px, #b9f -1px -1px 2px, #b9f 1px -1px 2px, #b9f -1px 1px 2px;
			content: "❃";
		}
    #item-embed-editor {
			visibility: hidden;
		}
		.flex-container {
			display: flex;
			justify-content: center;
			align-items: stretch;
			margin: 0px 30px;
		}
		.flex-container>div {
			margin: 0px 5px;
			overflow-y: scroll;
		}
	</style>
</head>
<body>
	<script src="https://connect.soundcloud.com/sdk/sdk-3.0.0.js" type="text/javascript"></script>
	<script src="https://www.youtube.com/iframe_api" type="text/javascript"></script>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<!-- contents -->
	<div class="flex-container">
    <div style="min-height: 100px; flex-shrink: 1;">
			<h1 class="text-center">Dev Kit Tool</h1>
      <!-- Game -->
      <iframe id="item-embed-iframe" src="<?php echo $src; ?>" frameborder="0" class="fit force-focus"></iframe>
			<!-- information -->
			<h4>Title: <strong><?php echo $stage['Title']; ?></strong></h4>
			<hr>
			<!-- description -->
			<h5>Ctrl+Enter: RUN with sessionStorage</h5>
			<hr>
			<!-- Buttons -->
			<button type="button" name="button" class="btn btn-block btn-primary">Sync</button>
    </div>
    <div style="min-height: 100px; flex-grow: 1;">
      <!-- Code -->
			<div id="item-embed-code" class="hidden"><?php echo $stage['RawCode']; ?></div>
      <textarea id="item-embed-editor" value=""></textarea>
    </div>
  </div>
	<div class="container-open-external affix">
	<?php for ($i = 1; $i <= 3; $i++) : ?>
		<div class="item-open-external">
			<div class="embed-frame"></div>
			<div class="side-menu">
				<span class="glyphicon glyphicon-remove"></span>
				<span class="glyphicon glyphicon glyphicon-pushpin"></span>
				<span class="glyphicon glyphicon-chevron-right"></span>
			</div>
		</div>
	<?php endfor; ?>
	</div>
</body>
</html>
