<?php
/* updatelevel.php
 * Levelの情報を更新する
 * Input:	id , StageID
 * Output:	invalid-id , invalid-stageid , success
*/

try {

	require_once '../preload.php';

	// 値の取得とバリデーション
	$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
	if (!$id) {
		exit('invalid-id');
	}
	$stageid	= filter_input(INPUT_POST, 'stageid');
	if (!$stageid) {
		exit('invalid-stageid');
	}

	// 更新
	$stmt	= $dbh->prepare('UPDATE "_Level" SET "StageID"=:stageid WHERE "ID"=:id');
	$stmt->bindValue(":id", $id, PDO::PARAM_INT);
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_STR);
	$stmt->execute();

	exit('success');


} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
}
?>