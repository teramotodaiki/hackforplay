<?php
/*
Preferences ユーザーの環境設定などのページ。セッションが必要
ユーザーの情報の閲覧や更新は非同期なAPIを用いる
*/


try {

	require_once '../preload.php';

	include 'view.php';

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>
