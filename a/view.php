<!-- HTML -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>あそべるプログラミング hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class="">
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="../chartjs/Chart.js" type="text/javascript" charset="utf-8"></script>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<script src="chart.js" type="text/javascript" charset="utf-8"></script>
	<!-- Modal -->
	<div class="modal fade" id="codeModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		    	</div>
			    <div class="modal-body">
			    	<pre><code></code></pre>
			    </div>
	    		<div class="modal-footer">
	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
	    		</div>
			</div>
		</div>
	</div>
	<div class="modal fade" id="rejectModal" tabindex="-1" role="dialog">
		<div class="modal-dialog">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
	    			<h4>リジェクトする理由</h4>
		    	</div>
			    <div class="modal-body">
			    	<form>
			    		<button type="submit" class="btn btn-danger btn-lg btn-block" >リジェクト</button>
			    	</form>
			    </div>
	    		<div class="modal-footer">
	        		<button type="button" class="btn btn-default" data-dismiss="modal">閉じる</button>
	    		</div>
			</div>
		</div>
	</div>
	<!-- contents -->
	<div class="container panel panel-default">
		<div class="row panel-body">
			<ul class="col-md-2 nav nav-pills nav-stacked panel-body" role="tablist">
			    <li role="presentation">
			    	<a href="#summary" aria-controls="summary" role="tab" data-toggle="tab">summary</a>
			    </li>
			    <li role="presentation">
			    	<a href="#activerate" aria-controls="activerate" role="tab" data-toggle="tab">アクティブ率</a>
			    </li>
			    <li role="presentation">
			    	<a href="#playcount" aria-controls="playcount" role="tab" data-toggle="tab">プレイ回数</a>
			    </li>
			    <li role="presentation">
			    	<a href="#judge" aria-controls="judge" role="tab" data-toggle="tab">judge</a>
			    </li>
			</ul>
			<div class="col-md-10 tab-content">
			    <div role="tabpanel" class="tab-pane" id="summary">
			    	<div class="chart text-center">
			    	</div>
			    	<div class="detail table-responsive">
			    		<table class="table table-striped">
			    			<caption>詳細</caption>
			    			<thead>
			    				<tr>
			    					<th>Message</th>
			    					<th>Code</th>
			    					<th>File</th>
			    					<th>Line</th>
			    				</tr>
			    			</thead>
			    			<tbody class="detail-container">
			    			</tbody>
			    		</table>
			    	</div>
			    </div>
			    <div role="tabpanel" class="tab-pane" id="activerate">
					<canvas id="canvas" height="300" width="600"></canvas>
			    </div>
			    <div role="tabpanel" class="tab-pane" id="playcount">
					<canvas id="canvas" height="300" width="600"></canvas>
			    </div>
			    <div role="tabpanel" class="tab-pane" id="judge">
			    	<div class="row list-judging"></div>
			    </div>
			</div>
		</div>
	</div>
</body>
</html>