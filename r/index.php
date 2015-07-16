<?php
try {

	require_once '../preload.php';

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$fetch_start_id		= filter_input(INPUT_GET, 'start', FILTER_VALIDATE_INT);
	if (!$fetch_start_id) {
		$fetch_start_id	= 0;
	}

	$stmt				= $dbh->prepare('SELECT COUNT(*) FROM "Stage" WHERE "Mode"=:replay AND "State"=:published');
	$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$stmt->execute();
	$stage_num			= $stmt->fetch(PDO::FETCH_COLUMN, 0);

	$filter				= filter_input(INPUT_GET, 'filter');

	include('view.php');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}
?>