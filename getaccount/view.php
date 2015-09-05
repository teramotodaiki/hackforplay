<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>Get Account hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class="">
	<?php require_once '../analyticstracking.php'; ?>
	<?php require_once '../fb-root.php'; ?>
	<?php require_once '../sendattendance.php'; ?>
	<script src="view.js" type="text/javascript" charset="utf-8"></script>
	<?php require_once 'modal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script type="text/javascript" charset="utf-8">
	// ログインページ用のTwitter OAuth認証
	$(function() {
		var authed = '/loginsuccess.php';
		var login_successed = '/?debug=fromgetaccount'; // トップページに移動
		$('.panel-login a#button-loginwithtwitter').attr('href',
			'/loginwithtwitter.php?authed=' + encodeURIComponent(authed) +
			'&login_successed=' + encodeURIComponent(login_successed));
	});
	</script>
	<div class="container">
		<div class="row">
			<div class="col-xs-12 text-center">
				<img src="../img/768/topreback.png" class="img-responsive center-block" alt="">
			</div>
			<div class="col-xs-12 col-lg-offset-3 col-lg-6">
				<div class="panel panel-default margin-top-sm margin-bottom-lg">
					<div class="panel-body text-center">
						<h3><b>アカウントを てにいれた！</b></h3>
						<p>おめでとうございます。すきなタイプを えらんでください</p>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-4">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3>ペーパーログイン <span class="label label-success">かんたん</span></h3>
					</div>
					<div class="panel-body">
						<p>texttexttexttexttexttexttexttexttexttext</p>
						<button type="button" class="btn btn-lg btn-primary" data-toggle="modal" data-target="#modal-signup-paper">けってい</button>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-4">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3>メールアドレスで とうろく</h3>
					</div>
					<div class="panel-body">
						<p>texttexttexttexttexttexttexttexttexttext</p>
						<button type="button" class="btn btn-lg btn-primary" data-toggle="modal" data-target="#modal-signup-email">けってい</button>
						<button type="button" class="btn btn-link">仮パスワードを入力</button>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-sm-4">
				<div class="panel panel-default">
					<div class="panel-heading">
						<h3>ツイッターで とうろく</h3>
					</div>
					<div class="panel-body">
						<p>texttexttexttexttexttexttexttexttexttext</p>
						<button type="button" class="btn btn-lg btn-primary">けってい</button>
					</div>
				</div>
			</div>
			<div class="col-xs-12 col-lg-offset-3 col-lg-6">
				<div class="panel panel-default margin-top-lg margin-bottom-lg panel-after-signup hidden">
					<div class="panel-body text-center">
						<h3><b>アカウントができたら つぎにすすもう</b></h3>
			    		<a href="../login/" class="btn btn-primary btn-lg" title="Next">ログイン</a>
					</div>
				</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>