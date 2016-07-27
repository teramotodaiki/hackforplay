<?php
try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();


	include('view.php');

} catch (Exception $e) {
	header('Location: ../e');
	throw $e;
	die;
}
?>
