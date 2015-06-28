<?php
/*
与えられたStageIDに該当するステージが、自分のステージであり公開中のとき、ステージを非公開状態にする
Input:	stage_id , (attendance-token)
Output:	no-session , database-error
*/

require_once '../preload.php';

try {

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	// セッションを取得
	if (!isset($session_userid)) {
		exit('no-session');
	}

	$stage_id = filter_input(INPUT_POST, 'stage_id', FILTER_VALIDATE_INT);
	if ($stage_id === FALSE || $stage_id === NULL) {
		exit();
	}

	// 状態を変更
	$stmt	= $dbh->prepare('UPDATE "Stage" SET "State"=:private WHERE "ID"=:stage_id AND "UserID"=:userid AND "State"=:published');
	$stmt->bindValue(":private", 'private', PDO::PARAM_STR);
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('database-error');
	}

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>