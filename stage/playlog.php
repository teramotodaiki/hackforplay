<?php
/*
ステージプレイのログをつける
Input:	value , attendance-token
Output:	(success)
*/

try {

	require_once '../preload.php';

	$attendance_token	= filter_input(INPUT_POST, 'attendance-token');
	$stmt				= $dbh->prepare('SELECT "ID" FROM "Attendance" WHERE "Token"=:token');
	$stmt->bindValue(":token", $attendance_token, PDO::PARAM_STR);
	$stmt->execute();
	$attendance_id		= $stmt->fetch(PDO::FETCH_COLUMN, 0);
	if (!$attendance_id) {
		exit();
	}

	// ログをつける
	$value				= filter_input(INPUT_POST, 'value');
	require_once '../attendance/keyvaluedata.php';
	setData($attendance_id, array('PlayLog' => $value));

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>