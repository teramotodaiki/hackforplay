<?php
/*
トークンとひも付けられたプロジェクトが、自分のプロジェクトであり、disabledステートであるとき、ステートをenabledにして情報を返す
Input:	token , (attendance-token)
Output: no-session , invalid-token , database-error , JSON:{information_of_project}
information_of_projects:
{
	id : プロジェクトのID,
	source_id : 改造元ステージのID,
	source_title : 改造元ステージの名前,
	source_mode : 改造元ステージのMode (official, replay),
	token : プロジェクトのトークン,
	thumbnail : サムネイルのURL,
	registered : 作成された日時
}
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
	$stmt	= $dbh->prepare('SELECT p."ID",p."Token",p."Registered",p."SourceStageID",s."Title",s."Mode" FROM "Project" AS p LEFT OUTER JOIN "Stage" AS s ON p."SourceStageID"=s."ID" WHERE p."Token"=:token AND p."UserID"=:userid AND p."State"=:disabled');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":disabled", 'disabled', PDO::PARAM_STR);
	$stmt->execute();
	$project = $stmt->fetch(PDO::FETCH_ASSOC);
	if (empty($project)) {
		exit('invalid-token');
	}

	// ステートを更新
	$stmt	= $dbh->prepare('UPDATE "Project" SET "State"=:enabled WHERE "ID"=:project_id');
	$stmt->bindValue(":enabled", 'enabled', PDO::PARAM_STR);
	$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if(!$flag){
		exit('database-error');
	}

	// 最も新しい(値の大きい)Scriptのサムネイルを取得
	$stmt	= $dbh->prepare('SELECT "Thumbnail" FROM "Script" WHERE "ProjectID"=:project_id ORDER BY "ID" DESC');
	$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
	$stmt->execute();
	$thumb	= $stmt->fetch(PDO::FETCH_COLUMN, 0);

	$item 	= new stdClass();
	$item->id 			= $project['ID'];
	$item->source_id 	= $project['SourceStageID'];
	$item->source_title	= $project['Title'];
	$item->source_mode	= $project['Mode'];
	$item->token 		= $project['Token'];
	$item->thumbnail	= $thumb ? $thumb : '';
	$item->registered 	= $project['Registered'];

	// 出力
	$json = json_encode($item);
	if ($json === FALSE) {
		exit('parse-error');
	}
	echo $json;

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die();
}
?>
