<?php

$stmt = $dbh->prepare('SELECT "Title","ScriptID","RawCode","Updated" FROM "Stage" INNER JOIN "Script" ON "Stage"."ScriptID"="Script"."ID" WHERE "Stage"."ID"=:id');
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$stage = $stmt->fetch(PDO::FETCH_ASSOC) or die("Invalid stage id $id");
$src = '/embed/?type=stage&id=' . $id;

?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title><?php echo $stage['Title']; ?> - HackforPlay</title>
	<script type="text/javascript">
	stageInfo = {
		StageID: <?php echo $id; ?>,
		Title: '<?php echo $stage['Title']; ?>',
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
			align-items: stretch;
			padding: 0px 30px;
		}
		.flex-container>div {
			flex: 1 1 auto;
			padding: 0px 5px;
			overflow-y: scroll;
		}
		.flex-container .flex-item-fix {
			flex: 0 0 auto;
		}
	</style>
</head>
<body>
	<script src="https://connect.soundcloud.com/sdk/sdk-3.0.0.js" type="text/javascript"></script>
	<script src="https://www.youtube.com/iframe_api" type="text/javascript"></script>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<!-- contents -->
	<div class="flex-container">
    <div class="flex-item-fix">
			<h1 class="text-center">Dev Kit Tool</h1>
      <!-- Game -->
      <iframe id="item-embed-iframe" src="<?php echo $src; ?>" frameborder="0" class="fit"></iframe>
			<!-- information -->
			<h4>Title: <strong><?php echo $stage['Title']; ?></strong></h4>
			<h4>Latest:<span class="info-latest-update"><?php echo $stage['Updated']; ?></span><small>GMT</small></h4>
			<hr>
			<!-- description -->
			<h5>Ctrl+Enter: RUN with sessionStorage</h5>
			<h5>Go to menu: <a href="/devkit/">here</a></h5>
			<hr>
			<!-- Buttons -->
			<button type="button" class="btn btn-block btn-primary disabled" data-query="sync">Sync</button>
    </div>
    <div>
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
