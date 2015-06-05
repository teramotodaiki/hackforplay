<?php
/*
管理者用API。与えられたIDに該当するステージをリジェクトする。そのステージのステートは問わない。ただしデータは削除されない
Input:	stage_id , reasons:JSON , (attendance-token)
Ouput:	failed , success
*/

require_once '../preload.php';

try {

	$stage_id 	= filter_input(INPUT_POST, 'stage_id', FILTER_VALIDATE_INT);
	if ($stage_id === FALSE || $stage_id === NULL) {
		exit('failed');
	}

	// リジェクトの理由
	$reasons_json	= filter_input(INPUT_POST, 'reasons');
	$reasons		= json_decode($reasons_json);
	if ($reasons && !empty($reasons)) {
		$registered		= gmdate("Y-m-d H:i:s") . date("P");
		$placeHolder	= array_fill(0, count($reasons), "($stage_id,?,'$registered')");
		$stmt			= $dbh->prepare('INSERT INTO "RejectReasonMap" ("StageID","DataID","Registered") VALUES '
			. implode(',', $placeHolder));
		foreach ($reasons as $key => $value) {
			$stmt->bindValue($key + 1, $value, PDO::PARAM_INT);
		}
		$flag	= $stmt->execute();
		if (!$flag) {
			exit('failed');
		}
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