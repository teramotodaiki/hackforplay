<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>あそべるプログラミング hackforplay</title>
	<link rel="stylesheet" href="">
	<?php require_once '../library.php' ?>
	<!-- Open graph protocol -->
	<meta property="og:title" content="あそべるプログラミング HackforPlay"/>
	<meta property="og:description" content="プログラミングをゲームで学ぼう。小中学生向けの教育ゲーム ハックフォープレイ"/>
	<meta property="og:image" content="http://hackforplay.xyz/img/ogimg.jpg"/>
	<meta property="og:url" content="http://hackforplay.xyz"/>
	<meta property="og:type" content="game"/>
	<meta property="og:site_name" content="あそべるプログラミング HackforPlay"/>
</head>
<body>
	<?php require_once '../analyticstracking.php' ?>
	<?php require_once '../fb-root.php' ?>
	<?php require_once '../sendattendance.php'; ?>
	<?php require_once '../view/header.php'; ?>
	<?php require_once '../view/authmodal.php'; ?>
	<script type="text/javascript" charset="utf-8">
	$(function(){
		checkSigninSession(function(data){
			if(data === 'success'){
				// パスワードの変更
				$('#authModal').off('shown.bs.modal').on('shown.bs.modal', function() {
					$('#authModal .modal-body').hide();
					$('#authModal .auth-page-3').show('fast');
				}).modal('show');
			}
		});
	});

	</script>
	<div class="container">
		<div class="row">
			<div class="col-md-12 panel panel-default">
				<div class="panel-body text-center">
					<a href="/m" title="Go to mypage" class="btn btn-link btn-lg" >マイページ</a>
				</div>
			</div>
		</div>
	</div>
</body>
</html>