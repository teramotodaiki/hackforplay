<?php
/*
新たにプロジェクトを作成する
Input:	stageid , (data)
Output: no-session , invalid-stageid , database-error, {project-token}
*/

require_once '../preload.php';

// セッションの取得
session_start();
if (!isset($_SESSION['UserID'])) {
	exit('no-session');
}
$userid	= $_SESSION['UserID'];
session_commit();

// ステージ情報の取得
$stageid = filter_input(INPUT_POST, 'stageid', FILTER_VALIDATE_INT);
if($stageid == FALSE || $stageid == NULL){
	exit('invalid-stageid');
}
try {
	$stmt	= $dbh->prepare('SELECT "ProjectID" FROM "Stage" WHERE "ID"=:stageid');
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->execute();
	$stage 	= $stmt->fetch(PDO::FETCH_ASSOC);
	if($stage == NULL){
		exit('invalid-stageid');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// データの取得
$data 	= filter_input(INPUT_POST, 'data');

// プロジェクト情報の取得
$project_rootid = NULL;
if ($stage['ProjectID'] != NULL) {
	try {
		$stmt	= $dbh->prepare('SELECT "RootID" FROM "Project" WHERE "ID"=:stage_projectid');
		$stmt->bindValue(":stage_projectid", $stage['ProjectID'], PDO::PARAM_INT);
		$stmt->execute();
		$project = $stmt->fetch(PDO::FETCH_ASSOC);
		$project_rootid = $project['RootID'];

	} catch (PDOException $e) {
		print_r($e);
		die();
	}
}

// プロジェクトの作成
$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
$token	= bin2hex($bytes);
try {
	$stmt	= $dbh->prepare('INSERT INTO "Project" ("UserID","RootID","ParentID","Data","Token","Registered") VALUES(:userid,:project_rootid,:stage_projectid,:data,:token,:gmt)');
	$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
	$stmt->bindValue(":project_rootid", $project_rootid, PDO::PARAM_INT);
	$stmt->bindValue(":stage_projectid", $stage['ProjectID'], PDO::PARAM_INT);
	$stmt->bindValue(":data", $data, PDO::PARAM_STR);
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s").date("P"), PDO::PARAM_STR);
	$flag 	= $stmt->execute();
	if(!$flag){
		exit('database-error');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// ParentIDがNULLのとき、自身のIDをRootIDにする
if ($stage['ProjectID'] == NULL) {
	try {
		$stmt	= $dbh->prepare('UPDATE "Project" SET "RootID"=:projectid WHERE "ID"=:projectid');
		$stmt->bindValue(":projectid", $dbh->lastInsertId('Project'), PDO::PARAM_INT);
		$stmt->execute();

	} catch (PDOException $e) {
		print_r($e);
		die();
	}
}

exit($token);

?>