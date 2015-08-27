<?php

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// セッションがある場合は / に遷移する
	if ($session_userid) {
		header('Location: /');
	} else {
		include 'view.php';
	}

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}

?>