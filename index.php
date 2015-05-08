<?php
/*
ランディングページ
サインインされたセッションが存在し、 ?rewrite がFALSEでない場合、 /r に再送する
*/

require_once 'preload.php';

// セッションの取得
session_start();
if (isset($_SESSION['UserID'])) {
	$userid	= $_SESSION['UserID'];
}
session_commit();

$rewrite = filter_input(INPUT_GET, 'rewrite', FILTER_VALIDATE_BOOLEAN);
if (isset($userid) && $rewrite !== FALSE) {
	header('Location:../r');
	exit();
}

include 'view/main.php';
?>