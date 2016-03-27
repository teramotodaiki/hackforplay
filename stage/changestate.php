<?php
/*
与えられたStageIDに該当するステージが、自分のステージであり、与えられたステートに遷移可能であるとき、ステートを遷移させる
Input:	stage_id , state , (attendance-token)
Output:	no-session , not-allowed , database-error
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

	// ステージ情報を取得
	$stage_id	= filter_input(INPUT_POST, 'stage_id', FILTER_VALIDATE_INT);
	if ($stage_id === FALSE || $stage_id === NULL) {
		exit();
	}
	$stmt		= $dbh->prepare('SELECT "State","UserID" FROM "Stage" WHERE "ID"=:stage_id');
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$stmt->execute();
	$stage		= $stmt->fetch(PDO::FETCH_ASSOC);
	if (!isset($stage['UserID']) || $session_userid != $stage['UserID']) {
		exit('not-allowed');
	}

	// ステートが遷移できるのは
	$transitions	= array(
		'published'	=> array('private'),
		'private'	=> array('published'),
		'judging'	=> array('pending', 'rejected'),
		'queue'		=> array('pending'),
		'pending'	=> array('judging')
	);

	$state		= filter_input(INPUT_POST, 'state'); // 遷移後のステート
	$previous	= $stage['State'];	// 現在のステート
	if (!in_array($state, $transitions[$previous])) {
		exit('not-allowed');
	}

	// 状態を変更
	$stmt	= $dbh->prepare('UPDATE "Stage" SET "State"=:state WHERE "ID"=:stage_id');
	$stmt->bindValue(":state", $state, PDO::PARAM_STR);
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('database-error');
	}

	exit('success');

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die('database-error');
}

?>
