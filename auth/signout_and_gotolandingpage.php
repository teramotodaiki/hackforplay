<?php
/*
サインアウトしてランディングページにリダイレクトする
*/

try {

	require_once '../preload.php';

	session_start();
	setcookie(session_name(), '', time() - 1);

	session_destroy();
	session_commit();

	header('Location: /');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}


?>