<?php
/*
新たにプロジェクトを作成する
Input:	stageid , (attendance-token)
Output: no-session , invalid-stageid , unauthorized-restage , database-error, {project-token}
*/

require_once '../preload.php';

try {

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

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

	$stmt	= $dbh->prepare('SELECT "ProjectID","Src","NoRestage" FROM "Stage" WHERE "ID"=:stageid');
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->execute();
	$stage 	= $stmt->fetch(PDO::FETCH_ASSOC);
	if($stage === NULL){
		exit('invalid-stageid');
	}
	if ($stage['NoRestage']) {
		exit('unauthorized-restage');
	}

	// プロジェクト情報の取得
	$project_rootid = NULL;
	if ($stage['ProjectID'] !== NULL) {
		$stmt	= $dbh->prepare('SELECT "RootID" FROM "Project" WHERE "ID"=:stage_projectid');
		$stmt->bindValue(":stage_projectid", $stage['ProjectID'], PDO::PARAM_INT);
		$stmt->execute();
		$project = $stmt->fetch(PDO::FETCH_ASSOC);
		$project_rootid = $project['RootID'];
	}

	// プロジェクトの作成
	$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
	$token	= bin2hex($bytes);

	$stmt	= $dbh->prepare('INSERT INTO "Project" ("UserID","RootID","ParentID","SourceStageID","Token","State","Registered") VALUES(:userid,:project_rootid,:stage_projectid,:stageid,:token,:enabled,:gmt)');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":project_rootid", $project_rootid, PDO::PARAM_INT);
	$stmt->bindValue(":stage_projectid", $stage['ProjectID'], PDO::PARAM_INT);
	$stmt->bindValue(":stageid", $stageid, PDO::PARAM_INT);
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":enabled", 'enabled', PDO::PARAM_STR);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);
	$flag 	= $stmt->execute();
	if(!$flag){
		exit('database-error');
	}
	$new_project_id = $dbh->lastInsertId('Project');

	// ParentIDがNULLのとき、自身のIDをRootIDにする
	if ($stage['ProjectID'] === NULL) {
		$stmt	= $dbh->prepare('UPDATE "Project" SET "RootID"=:projectid1 WHERE "ID"=:projectid2');
		$stmt->bindValue(":projectid1", $new_project_id, PDO::PARAM_INT);
		$stmt->bindValue(":projectid2", $new_project_id, PDO::PARAM_INT);
		$stmt->execute();
	}

	// ステージを事前に作成
	$stmt	= $dbh->prepare('INSERT INTO "Stage" ("UserID","Mode","ProjectID","State","SourceID","Src") VALUES(:userid,:replay,:projectid,:reserved,:source_id,:stage_src)');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
	$stmt->bindValue(":projectid", $new_project_id, PDO::PARAM_INT);
	$stmt->bindValue(":reserved", 'reserved', PDO::PARAM_STR);
	$stmt->bindValue(":source_id", $stageid, PDO::PARAM_INT);
	$stmt->bindValue(":stage_src", $stage['Src'], PDO::PARAM_STR);
	$flag 	= $stmt->execute();
	if (!$flag) {
		exit('database-error');
	}
	$new_stage_id = $dbh->lastInsertId('Stage');

	$stmt	= $dbh->prepare('UPDATE "Project" SET "ReservedID"=:new_stage_id WHERE "ID"=:projectid');
	$stmt->bindValue(":new_stage_id", $new_stage_id, PDO::PARAM_INT);
	$stmt->bindValue(":projectid", $new_project_id, PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if (!$flag) {
		exit('database-error');
	}

	exit($token);

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die();
}
?>
