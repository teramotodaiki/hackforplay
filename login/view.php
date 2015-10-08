<!DOCTYPE html>
<html>
<head prefix="og: http://ogp.me/ns#">
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>ログイン hackforplay</title>
	<?php require_once '../library.php' ?>
</head>
<body class="">
	<?php require_once '../externalcodes.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<script type="text/javascript" charset="utf-8">
	// ログインページ用のTwitter OAuth認証
	$(function() {
		var authed = '/loginsuccess.php';
		var login_successed = window.location.pathname + window.location.search; // 仮に今いるページに帰還
		$('.panel-login a#button-loginwithtwitter').attr('href',
			'/loginwithtwitter.php?authed=' + encodeURIComponent(authed) +
			'&login_successed=' + encodeURIComponent(login_successed));
	});
	</script>
	<div class="container">
		<div class="row">
			<div class="col-xs-12">
			<?php
			switch (filter_input(INPUT_GET, 'state')) {
				case 'unregistered': ?>

				<p class="alert alert-danger">
					<span class="glyphicon glyphicon-user"></span>
					<span class="written-in-ja">アカウントが見つかりませんでした</span>
				</p>

					<?php
					break;
				case 'incorrect': ?>

				<p class="alert alert-danger">
					<span class="glyphicon glyphicon-remove-circle"></span>
					<span class="written-in-ja">パスワードがまちがっています</span>
				</p>

				<?php
				default:
					break;
			}
			?>
			</div>
			<div class="col-xs-12">
				<div class="panel panel-default panel-login">
					<div class="row panel-body">
						<div class="col-lg-8 col-xs-12">
							<form class="form-horizontal" action="../auth/signin.php" method="post" accept-charset="utf-8">
								<div class="form-group">
									<label class="written-in-ja control-label col-sm-6" for="navbarLoginEmail">メールアドレスまたはペーパーログインID</label>
									<div class="col-sm-6">
										<input class="form-control" name="email" id="navbarLoginEmail" type="text">
									</div>
								</div>
								<div class="form-group">
									<label class="written-in-ja control-label col-sm-6" for="navbarLoginPassword">パスワード</label>
									<div class="col-sm-6">
										<input class="form-control" name="password" id="navbarLoginPassword" type="password">
									</div>
								</div>
								<div class="form-group">
									<div class="col-sm-offset-6 col-sm-6">
										<button class="written-in-ja btn btn-default" type="submit">ログイン</button>
										<button type="button" class="btn btn-link" data-dismiss="modal" data-toggle="modal" data-target="#resetModal">パスワードを忘れました</button>
									</div>
								</div>
							</form>

						</div>
						<div class="col-lg-4 col-xs-12">
							<div class="text-center">
								<p class="written-in-ja text-muted">ツイッターでログイン または 登録</p>
								<a href="#" id="button-loginwithtwitter" title="Login with Twitter">
					  				<img src="../img/signin-with-twitter.png" alt="Signin with twitter">
								</a>
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