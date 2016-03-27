<?php
/*
トークンとひも付けられたプロジェクトが、自分のプロジェクトだった場合、ステートをdisabledにする
Input:	token , (attendance-token)
Output: no-session , invalid-token , database-error , success
*/

require_once '../preload.php';

try {

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	if (!isset($session_userid)) {
		exit('no-session');
	}

	// プロジェクト情報を取得
	$token = filter_input(INPUT_POST, 'token');
	if($token === NULL || $token === FALSE){
		exit('invalid-token');
	}

	$stmt	= $dbh->prepare('SELECT "ID" FROM "Project" WHERE "Token"=:token AND "UserID"=:userid');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
	$project = $stmt->fetch(PDO::FETCH_ASSOC);
	if (empty($project)) {
		exit('invalid-token');
	}

	// ステートを更新
	$stmt	= $dbh->prepare('UPDATE "Project" SET "State"=:disabled WHERE "ID"=:project_id');
	$stmt->bindValue(":disabled", 'disabled', PDO::PARAM_STR);
	$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if(!$flag){
		exit('database-error');
	}

	exit('success');

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die();
}
?>
