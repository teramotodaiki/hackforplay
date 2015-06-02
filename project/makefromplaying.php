<?php
/*
魔道書などで実行されたコードを記録するために、新たにプロジェクトを作成する。セッションは義務ではない
Input:	stageid , (attendance-token) , timezone
Output: failed , {project-token}
*/

require_once '../preload.php';

try {

	$stageid = filter_input(INPUT_POST, 'stageid', FILTER_VALIDATE_INT);
	if($stageid === FALSE || $stageid === NULL){
		exit('failed');
	}
	$timezone = filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
	if($timezone === FALSE || $timezone === NULL){
		$timezone = '+00:00';
	}

	// Attendanceの取得
	$attendance_token = filter_input(INPUT_POST, 'attendance-token');
	if ($attendance_token !== NULL) {
		$stmt	= $dbh->prepare('SELECT "UserID" FROM "Attendance" WHERE "Token"=:token');
		$stmt->bindValue(":token", $attendance_token, PDO::PARAM_STR);
		$stmt->execute();
		$attendance	= $stmt->fetch(PDO::FETCH_ASSOC);
		if (empty($attendance)) {
			unset($attendance);
		}
	}

	// プロジェクトの作成
	$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
	$token	= bin2hex($bytes);

	$stmt	= $dbh->prepare('INSERT INTO "Project" ("UserID","SourceStageID","Token","State","Registered") VALUES(:userid,:stageid,:token,:sendcode,:gmt)');
	$stmt->bindValue(":userid", isset($attendance) ? $attendance['UserID'] : NULL, PDO::PARAM_INT);
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":sendcode", 'sendcode', PDO::PARAM_STR);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);
	$flag 	= $stmt->execute();
	if(!$flag){
		exit('failed');
	}

	exit($token);

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>