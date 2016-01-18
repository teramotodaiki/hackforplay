<?php
/*
+**廃止***
トークンを取得し、 Attendance レコードを更新する
Input:	attendance-token
*/

require_once '../preload.php';

try {

	// トークンを取得
	$token = filter_input(INPUT_POST, 'attendance-token');
	if($token === NULL || $token === FALSE){
		exit();
	}
	$timezone = filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
	if($timezone === FALSE || $timezone === NULL){
		exit();
	}

	// レコードを更新
	$stmt	= $dbh->prepare('UPDATE "Attendance" SET "End"=:gmt WHERE "token"=:token');
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->execute();

	// 正常終了
	exit();

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>