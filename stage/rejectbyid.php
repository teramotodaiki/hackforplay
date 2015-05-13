<?php
/*
管理者用API。与えられたIDに該当するステージをリジェクトする。そのステージのステートは問わない。ただしデータは削除されない
Input:	stage_id
Ouput:	failed , success
*/

require_once '../preload.php';

$stage_id 	= filter_input(INPUT_POST, 'stage_id', FILTER_VALIDATE_INT);
if ($stage_id === FALSE || $stage_id === NULL) {
	exit('failed');
}

try {
	$stmt	= $dbh->prepare('UPDATE "Stage" SET "State"=:rejected WHERE "ID"=:stage_id');
	$stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('failed');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

exit('success');

?>