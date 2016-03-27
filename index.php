<?php
/*
ランディングページ
サインインされたセッションが存在し、 ?rewrite がFALSEでない場合、 /r に再送する
*/

try {
	require_once 'preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$rewrite = filter_input(INPUT_GET, 'rewrite', FILTER_VALIDATE_BOOLEAN);
	if (isset($session_userid) && $rewrite !== FALSE) {
		header('Location:../town/');
		exit();
	}

	include 'view/main.php';

} catch (Exception $e) {
	Rollbar::report_exception($e);
	header('Location: ../e');
}


?>
