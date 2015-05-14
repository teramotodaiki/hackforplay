<?php
/*
トークンとひも付けられたプロジェクトが、自分のプロジェクトであり、disabledステートであるとき、ステートをenabledにして情報を返す
Input:	token
Output: no-session , invalid-token , database-error , JSON:{information_of_project}
information_of_projects:
{
	id : プロジェクトのID,
	source_id : 改造元ステージのID,
	source_title : 改造元ステージの名前,
	source_mode : 改造元ステージのMode (official, replay)
	token : プロジェクトのトークン
	data : コードなどのデータ
	registered : 作成された日時
}
*/

require_once '../preload.php';

if (!isset($session_userid)) {
	exit('no-session');
}

// プロジェクト情報を取得
$token = filter_input(INPUT_POST, 'token');
if($token === NULL || $token === FALSE){
	exit('invalid-token');
}
try {
	$stmt	= $dbh->prepare('SELECT p."ID",p."Token",p."Registered",p."SourceStageID",s."Title",s."Mode" FROM "Project" AS p LEFT OUTER JOIN "Stage" AS s ON p."SourceStageID"=s."ID" WHERE p."Token"=:token AND p."UserID"=:userid AND p."State"=:disabled');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":disabled", 'disabled', PDO::PARAM_STR);
	$stmt->execute();
	$project = $stmt->fetch(PDO::FETCH_ASSOC);
	if (empty($project)) {
		exit('invalid-token');
	}
	require_once 'getcurrentcode.php';
	$project['Data']	= getCurrentCode($project['ID']);

} catch (PDOException $e) {
	print_r($e);
	die();
}

// ステートを更新
try {
	$stmt	= $dbh->prepare('UPDATE "Project" SET "State"=:enabled WHERE "ID"=:project_id');
	$stmt->bindValue(":enabled", 'enabled', PDO::PARAM_STR);
	$stmt->bindValue(":project_id", $project['ID'], PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if(!$flag){
		exit('database-error');
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

$item 	= new stdClass();
$item->id 			= $project['ID'];
$item->source_id 	= $project['SourceStageID'];
$item->source_title	= $project['Title'];
$item->source_mode	= $project['Mode'];
$item->token 		= $project['Token'];
$item->registered 	= $project['Registered'];
// dataを最初の4行だけ抜き出し
$data_exploded		= explode("\n", $project['Data'], 5);
if (count($data_exploded) > 4) {
	unset($data_exploded[4]);
}
$item->data			= implode("\n", $data_exploded);

// 出力
$json = json_encode($item);

if ($json === FALSE) {
	exit('parse-error');
}

echo $json;

 ?>