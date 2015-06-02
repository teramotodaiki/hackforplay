<?php
/*
管理者用API。与えられたIDに該当する審査中のステージを承認し公開する。
Input:	stage_id , (attendance-token)
Ouput:	failed , success
*/

require_once '../preload.php';

try {

	$stage_id 	= filter_input(INPUT_POST, 'stage_id', FILTER_VALIDATE_INT);
	if ($stage_id === FALSE || $stage_id === NULL) {
		exit('failed');
	}

	$stmt	= $dbh->prepare('SELECT "ID" FROM "Stage" WHERE "ID"=:stage_id AND "State"=:judging');
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$stmt->bindValue(":judging", 'judging', PDO::PARAM_STR);
	$stmt->execute();
	if (empty($stmt->fetch())) {
		exit('failed');
	}

	$stmt	= $dbh->prepare('UPDATE "Stage" SET "State"=:published,"Published"=:gmt WHERE "ID"=:stage_id');
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . date("P"), PDO::PARAM_STR); // サーバー時刻
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('failed');
	}

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>