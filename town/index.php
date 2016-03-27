<?php

try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	if (!$session_userid) {
		header('Location: ../login/');
		exit;
	}

	include 'view.php';

} catch (Exception $e) {
	Rollbar::report_exception($e);
	header('Location: ../e');
	exit;
}

?>
