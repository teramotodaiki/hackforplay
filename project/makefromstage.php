<?php
/*
新たにプロジェクトを作成する
Input:	stageid , (data)
Output: no-session , invalid-stageid , database-error, {project-token}
*/

require_once '../preload.php';

// セッションの取得
if (!isset($session_userid)) {
	exit('no-session');
}

$timezone = filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
if($timezone === FALSE || $timezone === NULL){
	$timezone = '+00:00';
}

// ステージ情報の取得
$stageid = filter_input(INPUT_POST, 'stageid', FILTER_VALIDATE_INT);
if($stageid === FALSE || $stageid === NULL){
	exit('invalid-stageid');
}
try {
	$stmt	= $dbh->prepare('SELECT "ProjectID" FROM "Stage" WHERE "ID"=:stageid');
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->execute();
	$stage 	= $stmt->fetch(PDO::FETCH_ASSOC);
	if($stage === NULL){
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
if ($stage['ProjectID'] !== NULL) {
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
	$stmt	= $dbh->prepare('INSERT INTO "Project" ("UserID","RootID","ParentID","SourceStageID","Data","Token","Registered") VALUES(:userid,:project_rootid,:stage_projectid,:stageid,:data,:token,:gmt)');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":project_rootid", $project_rootid, PDO::PARAM_INT);
	$stmt->bindValue(":stage_projectid", $stage['ProjectID'], PDO::PARAM_INT);
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->bindValue(":data", $data, PDO::PARAM_STR);
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);
	$flag 	= $stmt->execute();
	if(!$flag){
		exit('database-error');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// ParentIDがNULLのとき、自身のIDをRootIDにする
if ($stage['ProjectID'] === NULL) {
	try {
		$stmt	= $dbh->prepare('UPDATE "Project" SET "RootID"=:projectid1 WHERE "ID"=:projectid2');
		$stmt->bindValue(":projectid1", $dbh->lastInsertId('Project'), PDO::PARAM_INT);
		$stmt->bindValue(":projectid2", $dbh->lastInsertId('Project'), PDO::PARAM_INT);
		$stmt->execute();

	} catch (PDOException $e) {
		print_r($e);
		die();
	}
}

exit($token);

?>