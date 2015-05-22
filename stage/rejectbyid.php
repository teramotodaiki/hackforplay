<?php
/*
管理者用API。与えられたIDに該当するステージをリジェクトする。そのステージのステートは問わない。ただしデータは削除されない
Input:	stage_id , (attendance-token)
Ouput:	failed , success
*/

require_once '../preload.php';

try {

	$stage_id 	= filter_input(INPUT_POST, 'stage_id', FILTER_VALIDATE_INT);
	if ($stage_id === FALSE || $stage_id === NULL) {
		exit('failed');
	}

	$stmt	= $dbh->prepare('UPDATE "Stage" SET "State"=:rejected WHERE "ID"=:stage_id');
	$stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
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