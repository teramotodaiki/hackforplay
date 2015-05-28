<?php
try {

	require_once '../preload.php';

	$fetch_start_id		= filter_input(INPUT_GET, 'start', FILTER_VALIDATE_INT);
	if (!$fetch_start_id) {
		$fetch_start_id	= 0;
	}

	include('view.php');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>