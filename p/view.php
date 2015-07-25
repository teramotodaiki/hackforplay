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
	<meta name="viewport" content="width=device-width,initial-scale=1.0" />
	<title>設定 - あそべるプログラミング hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class="">
	<?php require_once '../analyticstracking.php'; ?>
	<?php require_once '../fb-root.php'; ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script type="text/javascript" charset="utf-8">
	<?php // セッションからUserIDを取得 ?>
	sessionStorage.setItem('view_user_id', '<?php echo $session_userid; ?>' );
	</script>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
				<div class="row panel panel-primary" role="tabpanel">
					<div class="col-xs-12 panel-heading">
						<h3 class="panel-title">設定</h3>
					</div>
					<ul class="col-xs-12 col-sm-3 nav nav-pills nav-stacked panel-body" role="tablist">
					    <li role="presentation" class="active">
					    	<a href="#usersettings" aria-controls="usersettings" role="tab" data-toggle="tab">ユーザー情報</a>
					    </li>
					    <li role="presentation">
					    	<a href="#setpassword" aria-controls="setpassword" role="tab" data-toggle="tab">パスワード</a>
					    </li>
					    <li role="presentation">
					    	<a href="#twitter" aria-controls="twitter" role="tab" data-toggle="tab">Twitter連携</a>
					    </li>
					    <li role="presentation">
					    	<a href="#mailaddress" aria-controls="mailaddress" role="tab" data-toggle="tab">メールアドレス設定</a>
					    </li>
					</ul>
					<div class="col-xs-12 col-sm-9 tab-content panel-body">
					    <div role="tabpanel" class="tab-pane active" id="usersettings">
					    	<form name="usersettings" class="form-horizontal">
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
								  	<button type="submit" class="btn btn-primary" disabled="disabled" data-loading-text="送信中…" disabled>保存</button>
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
							    	<label for="password" class="col-sm-3 control-label">パスワード</label>
							    	<div class="col-sm-8">
							    		<input type="password" class="form-control" id="password">
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
								  	<button type="submit" class="btn btn-primary" disabled="disabled" data-loading-text="送信中…" disabled>パスワードを変更</button>
							  	</div>
					    	</form>
					    </div>
					    <div role="tabpanel" class="tab-pane" id="twitter">
					    	<?php
					    	// 有効なTwitterアカウントがある場合
					    	if ($conneted_twitter) : ?>
						  	<div class="alert alert-danger">
							  	<button type="button" class="btn btn-danger btn-lg disconnect-twitter-account">Twitter連携を解除する</button>
						  		<h2 class="text-danger">警告：Twitterからログインできなくなってしまいます</h2>
						  		<span class="text-muted">メールアドレスでログインしているアカウントに切り替える場合など、限られた場合以外で使用することはオススメしません。</span>
						  	</div>
						  	<?php else: ?>
						  	<div class="alert alert-info">
						  		<button type="button" class="btn btn-info btn-lg add-twitter-connection">Twitterと連携する</button>
						  		<h2 class="text-info">Twitterからログインできるようになります</h2>
						  		<span class="text-muted">今までのメールアドレスでのログインも、引き続きご利用いただけます。</span>
						  	</div>
							<?php endif; ?>
					    </div>
					    <div role="tabpanel" class="tab-pane" id="mailaddress">
						  	<div class="alert alert-success">
						  		<button type="button" class="btn btn-success btn-lg" data-toggle="modal" data-target="#paper-emailsignup">メールアドレスを設定する</button>
						  		<h2 class="text-success">メールアドレスを設定すると、パスワードの変更やリセットを行うことができるようになります。</h2>
						  		<span class="text-muted">ペーパーログインは使用できなくなります。</span>
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