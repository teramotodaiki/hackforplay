<?php
/*
SendCodeで発生した例外をトレースする
Input:	project-token , message , (attendance-token)
Output:	(success)
*/
try {

	require_once '../preload.php';

	// ProjectIDを取得
	$project_token		= filter_input(INPUT_POST, 'project-token');
	$stmt	= $dbh->prepare('SELECT "ID" FROM "Project" WHERE "Token"=:token');
	$stmt->bindValue(":token", $project_token, PDO::PARAM_STR);
	$stmt->execute();
	$project_id			= $stmt->fetch(PDO::FETCH_COLUMN, 0);
	if (!$project_id) {
		throw new Exception("Project attached token that $project_token does not exist");
	}

	// Exception Dataの取得
	$message			= filter_input(INPUT_POST, 'message');
	$stmt	= $dbh->prepare('SELECT "ID" FROM "ExceptionData" WHERE "Message"=:message');
	$stmt->bindValue(":message", $message, PDO::PARAM_STR);
	$stmt->execute();
	$ex_id	= $stmt->fetch(PDO::FETCH_COLUMN, 0);

	if (empty($ex_id)) {
		// 新しくExceptionを追加
		$stmt	= $dbh->prepare('INSERT INTO "ExceptionData"("Message") VALUES(:message)');
		$stmt->bindValue(":message", $message, PDO::PARAM_STR);
		$stmt->execute();
		$ex_id	= $dbh->lastInsertId('ExceptionData');
	}

	// AttendanceIDを取得
	$attendance_id		= NULL;
	$attendance_token	= filter_input(INPUT_POST, 'attendance-token');
	if ($attendance_token !== NULL) {
		$stmt	= $dbh->prepare('SELECT "ID" FROM  "Attendance" WHERE "Token"=:token');
		$stmt->bindValue(":token", $attendance_token, PDO::PARAM_STR);
		$stmt->execute();
		$attendance_id	= $stmt->fetch(PDO::FETCH_COLUMN, 0);
		if (!$attendance_id) {
			$attendance_id	= NULL;
		}
	}
	// Mapにひも付け
	$stmt	= $dbh->prepare('INSERT INTO "SendcodeExceptionMap"("ProjectID","AttendanceID","DataID","Registered") VALUES(:project_id,:attendance_id,:ex_id,:gmt)');
	$stmt->bindValue(":project_id", $project_id, PDO::PARAM_INT);
	$stmt->bindValue(":attendance_id", $attendance_id, PDO::PARAM_INT);
	$stmt->bindValue(":ex_id", $ex_id, PDO::PARAM_INT);
	$stmt->bindValue(":gmt", gmdate('Y-m-d H:i:s'));
	$stmt->execute();

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>