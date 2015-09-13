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
	<script src="levelmake.js" type="text/javascript" charset="utf-8"></script>
	<script src="exmap.js" type="text/javascript" charset="utf-8"></script>
	<script src="judge.js" type="text/javascript" charset="utf-8"></script>
	<script src="chart.js" type="text/javascript" charset="utf-8"></script>
	<!-- Modal -->
	<div class="modal fade" id="codeModal" tabindex="-1" role="dialog">
		<div class="modal-dialog modal-lg">
			<div class="modal-content">
	    		<div class="modal-header">
			        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		    	</div>
			    <div class="modal-body">
			    	<pre class="overflow-auto"><code></code></pre>
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
			<ul class="col-xs-2 nav nav-pills nav-stacked panel-body" role="tablist">
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
			    	<a href="#poststage" aria-controls="poststage" role="tab" data-toggle="tab">投稿回数</a>
			    </li>
			    <li role="presentation">
			    	<a href="#continuoslylog" aria-controls="continuoslylog" role="tab" data-toggle="tab">継続ログイン</a>
			    </li>
			    <li role="presentation">
			    	<a href="#judge" aria-controls="judge" role="tab" data-toggle="tab">judge</a>
			    </li>
			    <li role="presentation">
			    	<a href="#levelmake" aria-controls="levelmake" role="tab" data-toggle="tab">Level Make</a>
			    </li>
			</ul>
			<div class="col-xs-10 tab-content">
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
			    <div role="tabpanel" class="tab-pane" id="poststage">
					<canvas id="canvas" height="300" width="600"></canvas>
			    </div>
			    <div role="tabpanel" class="tab-pane" id="continuoslylog">
					<canvas id="canvas" height="300" width="600"></canvas>
			    </div>
			    <div role="tabpanel" class="tab-pane" id="judge">
			    	<div class="row list-judging"></div>
			    </div>
			    <div role="tabpanel" class="tab-pane" id="levelmake">
		    		<?php foreach ($pavilion as $key => $value) : ?>
		    		<button type="button" class="btn btn-default load-pavilion" data-id="<?php echo $value['ID']; ?>">
		    			<?php echo $value['DisplayName']; ?>
		    		</button>
		    		<?php endforeach; ?>
			    	<div class="pavilion-info row">
			    		<div class="pavilion-body-1 col-xs-12">
				    		<div class="quest-info-sample row hidden">
				    			<div class="quest-body-1 col-xs-12">
				    				<form class="form-inline">
				    					<div class="form-group">
				    						<label for="QuestInfo">QuestStatus</label>
				    						<input type="text" class="form-control" id="QuestInfo" value="">
				    					</div>
			    						<button type="submit" class="btn btn-default">Update</button>
				    				</form>
				    			</div>
				    			<div class="quest-body-2">
					    			<div class="level-wrapper-sample col-xs-3 hidden">
					    				<form class="form-inline">
					    					<div class="form-group form-group-sm">
					    						<label for="LevelInfo">Lv.<span class="PlayOrder"></span></label>
					    						<input type="text" class="form-control" id="LevelInfo" size="6" value="">
					    					</div>
				    						<button type="submit" class="btn btn-default btn-sm">Update</button>
					    				</form>
					    			</div>
				    			</div>
				    			<div class="quest-body-3 col-xs-4 clearfix">
				    				<button type="button" class="btn btn-link">Add Level</button>
				    			</div>
				    		</div>
			    		</div>
			    		<div class="pavilion-body-2">
			    			<button type="button" class="btn btn-link">Add Quest</button>
			    		</div>
			    	</div>
			    </div>
			</div>
		</div>
	</div>
</body>
</html>