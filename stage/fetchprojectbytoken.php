<?php
/*
あたえられたトークンから、そのユーザーが制作したプロジェクトの情報を取得する。セッションが必要
Input:	token
Output:	no-session , missing-project , parse-error , JSON{information_of_project}
information_of_project:
	id : プロジェクトのID,
	source_id : 改造元ステージのID,
	source_title : 改造元ステージの名前,
	source_mode : 改造元ステージのMode (official, replay)
	data : ソースコードなどのデータ
	registered : 作成された日時
}
*/

require_once '../preload.php';

$token = filter_input(INPUT_POST, 'token');

if (!isset($session_userid)) {
	exit('no-session');
}

// プロジェクトの情報を取得
try {
	$stmt	= $dbh->prepare('SELECT p."ID",p."Data",p."Registered",p."SourceStageID",s."Title",s."Mode" FROM "Project" AS p LEFT OUTER JOIN "Stage" AS s ON p."SourceStageID"=s."ID" WHERE p."UserID"=:userid AND p."Token"=:token ORDER BY p."Registered" DESC');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->execute();
	$project = $stmt->fetch(PDO::FETCH_ASSOC);
	if ($project == NULL) {
		exit('missing-project');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// データを格納
$item 	= new stdClass();
$item->id 			= $project['ID'];
$item->source_id 	= $project['SourceStageID'];
$item->source_title	= $project['Title'];
$item->source_mode	= $project['Mode'];
$item->data 		= $project['Data'];
$item->registered 	= $project['Registered'];

// 出力
$json = json_encode($item);

if ($json == FALSE) {
	exit('parse-error');
}

echo $json;

?>