<?php
// game page


try {

	// preload
	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// get information/reserve play token
	require_once 'play.php';

	// load view
	require_once 'view.php';

} catch (Exception $e) {

	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}


 ?>