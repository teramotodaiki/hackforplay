<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>リソース hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class="">
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<div class="modal fade" id="useModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <h4 class="modal-title">このコードをステージ改造コードに書き加えてください</h4>
			        <p class="text-warning"><var>game.onenterframe</var> がすでに書かれている場合は、その中に書き入れてください</p>
		    	</div>
			    <div class="modal-body">
			    	<pre class-"font-family: monospace;">
game.preload(['img/path']);
game.onenterframe = function() {
	createSprite(w, h, {
		x: 0, y: 0,
		image: game.assets['img/path']
	});
}
			    	</pre>
			    </div>
	    		<div class="modal-footer">
	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
	    		</div>
			</div>
		</div>
	</div>
	<div class="container">
		<div class="row">
			<div id="anchor-enchantjs" class="col-md-12">
				<h2>enchant.js</h2>
				<div class="row">
					<div class="col-md-4 col-sm-6">
						<div class="thumbnail">
							<img src="../img/lp.jpg" height="817" width="1917">
							<div class="caption">
								<h3>File Name</h3>
								<dl>
									<dt>Size</dt>
									<dd>817x1917</dd>
									<dt>Example of use</dt>
									<dd><a href="../s?id=303" title="からのステージ">からのステージ</a></dd>
									<dd>...</dd>
								</dl>
								<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#useModal">Use This</button>
							</div>
						</div>
					</div>
					<div class="col-md-4 col-sm-6">
						<div class="thumbnail">
							<img src="../img/lp.jpg" height="817" width="1917">
							<div class="caption">
								<h3>File Name</h3>
								<dl>
									<dt>Size</dt>
									<dd>817x1917</dd>
									<dt>Example of use</dt>
									<dd><a href="../s?id=303" title="からのステージ">からのステージ</a></dd>
									<dd>...</dd>
								</dl>
								<button type="button" class="btn btn-primary">Use This</button>
								<button type="button" class="btn btn-info">View Frame</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>