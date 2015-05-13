<?php
/*
与えられたStageIDに該当するステージが、自分のステージであり非公開のとき、ステージを公開状態にする
Input:	stage_id
Output:	no-session , database-error
*/

require_once '../preload.php';

// セッションを取得
if (!isset($session_userid)) {
	exit('no-session');
}

$stage_id = filter_input(INPUT_POST, 'stage_id', FILTER_VALIDATE_INT);
if ($stage_id === FALSE || $stage_id === NULL) {
	exit();
}

// 状態を変更
try {
	$stmt	= $dbh->prepare('UPDATE "Stage" SET "State"=:published WHERE "ID"=:stage_id AND "UserID"=:userid AND "State"=:private');
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":private", 'private', PDO::PARAM_STR);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('database-error');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

exit('success');

?>