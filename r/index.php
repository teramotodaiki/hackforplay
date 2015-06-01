<?php
try {

	require_once '../preload.php';

	$fetch_start_id		= filter_input(INPUT_GET, 'start', FILTER_VALIDATE_INT);
	if (!$fetch_start_id) {
		$fetch_start_id	= 0;
	}

	$stmt				= $dbh->prepare('SELECT COUNT(*) FROM "Stage" WHERE "Mode"=:replay AND "State"=:published');
	$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$stmt->execute();
	$stagelist_length	= $stmt->fetch(PDO::FETCH_COLUMN, 0);


	include('view.php');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>