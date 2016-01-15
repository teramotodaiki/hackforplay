<?php
/**
 * Dashboard
 * そのアカウントの情報が見られる
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
