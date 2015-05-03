<?php
/*
Preferences のビュー
*/
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>設定 - あそべるプログラミング hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class="">
	<?php require_once '../analyticstracking.php'; ?>
	<?php require_once '../fb-root.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<div class="row panel panel-primary" role="tabpanel">
					<div class="col-md-12 panel-heading">
						<h3 class="panel-title">設定</h3>
					</div>
					<ul class="col-md-3 nav nav-pills nav-stacked panel-body" role="tablist">
					    <li role="presentation">
					    	<a href="#usersettings" aria-controls="usersettings" role="tab" data-toggle="tab">ユーザー情報</a>
					    </li>
					    <li role="presentation">
					    	<a href="#setpassword" aria-controls="setpassword" role="tab" data-toggle="tab">パスワード</a>
					    </li>
					</ul>
					<div class="col-md-9 tab-content panel-body">
					    <div role="tabpanel" class="tab-pane active" id="usersettings">
					    	<form name="usersettings" class="form-horizontal">
					    		<p class="alert alert-danger hide" role="alert"></p>
							  	<div class="form-group has-feedback">
							    	<label for="nickname" class="col-sm-3 control-label">ニックネーム</label>
							    	<div class="col-sm-8">
							    		<input type="text" class="form-control" id="nickname">
							    	</div>
							    	<div class="col-sm-1" data-toggle="tooltip" data-placement="left" title="本名は使用できません">
							    		<span class="glyphicon glyphicon-question-sign form-control-feedback"></span>
							    	</div>
							  	</div>
							  	<div class="text-right">
								  	<button type="submit" class="btn btn-primary" disabled="disabled">保存</button>
							  	</div>
					    	</form>
					    </div>
					    <div role="tabpanel" class="tab-pane" id="setpassword">
					    	<form name="setpassword" class="form-horizontal">
					    		<div class="form-group has-feedback">
					    			<label for="current" class="col-sm-3 control-label">現在のパスワード</label>
							    	<div class="col-sm-8">
							    		<input type="password" class="form-control" id="current">
							    	</div>
							    	<div class="col-sm-1">
							    	</div>
					    		</div>
						    	<div class="form-group has-feedback">
							    	<label for="new" class="col-sm-3 control-label">パスワード</label>
							    	<div class="col-sm-8">
							    		<input type="password" class="form-control" id="new">
							    	</div>
							    	<div class="col-sm-1" data-toggle="tooltip" data-placement="left" title="8文字以上の長さが必要です">
							    		<span class="glyphicon glyphicon-question-sign form-control-feedback"></span>
							    	</div>
							  	</div>
							  	<div class="form-group has-feedback">
							    	<label for="confirm" class="col-sm-3 control-label">もう一度入力</label>
							    	<div class="col-sm-8">
							    		<input type="password" class="form-control" id="confirm">
							    	</div>
							    	<div class="col-sm-1" data-toggle="tooltip" data-placement="left" title="上と同じ文字を入力してください">
							    		<span class="glyphicon glyphicon-question-sign form-control-feedback"></span>
							    	</div>
							  	</div>
							  	<div class="text-right">
								  	<button type="submit" class="btn btn-primary" disabled="disabled">パスワードを変更</button>
							  	</div>
					    	</form>
					    </div>
					</div>
		  		</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>