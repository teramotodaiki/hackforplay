<?php
/*
My project ユーザーごとのページ。プロジェクト一覧
ユーザーの情報の閲覧や更新は非同期なAPIを用いる
*/

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	if (isset($session_userid)) {
		include 'view.php';
	} else {
		header('Location:../');
	}

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>