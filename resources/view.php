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
	<script src="view.js" type="text/javascript"></script>
	<div class="modal fade" id="useModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <h4 class="modal-title">このコードをステージ改造コードに書き加えてください</h4>
			        <p class="text-warning"><var>game.onenterframe</var> がすでに書かれている場合は、その中に書き入れてください</p>
		    	</div>
			    <div class="modal-body">
			    	<pre>
game.preload(['----path----']);
game.onenterframe = function() {
	createSprite(w, h, {
		x: 0, y: 0,
		image: game.assets['----path----']
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
	<div class="modal fade" id="frameModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			        <h4 class="modal-title">Spriteクラスの<var>frame</var>プロパティに数値を指定します</h4>
		    	</div>
			    <div class="modal-body">
			    	<div class="frameMap" style="height: 242px">
				    	<img src="../img/lp.jpg" style="width: 568px; height: 242px">
				    	<table style="width: 568px; height: 242px;" class="table table-bordered">
			    			<tr>
			    				<td>1</td>
			    				<td>2</td>
			    				<td>3</td>
			    				<td>4</td>
			    			</tr>
			    			<tr>
			    				<td>5</td>
			    				<td>6</td>
			    				<td>7</td>
			    				<td>8</td>
			    			</tr>
				    	</table>
			    	</div>
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
				</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>