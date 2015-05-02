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
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../view/header.php'; ?>
	<div class="container">
		<div class="row">
			<div class="col-md-12">
				<div class="row panel panel-primary" role="tabpanel">
					<div class="col-md-12 panel-heading">
						<h3 class="panel-title">設定</h3>
					</div>
					<ul class="col-md-3 nav nav-pills nav-stacked panel-body" role="tablist">
					    <li role="presentation" class="active"><a href="#user" aria-controls="user" role="tab" data-toggle="tab">ユーザー情報</a></li>
					    <li role="presentation"><a href="#password" aria-controls="password" role="tab" data-toggle="tab">パスワード</a></li>
					</ul>
					<div class="col-md-9 tab-content panel-body">
					    <div role="tabpanel" class="tab-pane active" id="user">ユーザー情報</div>
					    <div role="tabpanel" class="tab-pane" id="password">This is Profile</div>
					</div>
		  		</div>
			</div>
		</div>
	</div>
	<?php require_once '../view/footer.php' ?>
</body>
</html>