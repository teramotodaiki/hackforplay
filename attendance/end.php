<?php
/*
+**廃止***
トークンを取得し、 Attendance レコードを更新する
Input:	attendance-token
*/

require_once '../preload.php';

try {

	exit();

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>