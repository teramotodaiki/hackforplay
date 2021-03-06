<?php
/*
トークンのみからプロジェクトの情報を取得し、セッションのUserIDでステージを投稿する
Input:	token , thumb , path , title , (attendance-token)
Output:	no-session , invalid-token , already-published , database-error , {id},{title}
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

// セッションを取得
if (!isset($session_userid)) {
	exit('no-session');
}

$timezone = filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
if($timezone === FALSE || $timezone === NULL){
	$timezone = '+00:00';
}

// プロジェクト情報を取得
$token = filter_input(INPUT_POST, 'token');
if($token === NULL || $token === FALSE){
	exit('invalid-token');
}

$stmt	= $dbh->prepare('SELECT "ID","SourceStageID","PublishedStageID" FROM "Project" WHERE "Token"=:token');
$stmt->bindValue(":token", $token, PDO::PARAM_STR);
$stmt->execute();
$project = $stmt->fetch(PDO::FETCH_ASSOC);
if(!$project){
	exit('invalid-token');
}elseif ($project['PublishedStageID'] !== NULL) {
	exit('already-published');
}

// サムネイルを作成
$thumb	= filter_input(INPUT_POST, 'thumb');

if ($thumb) {
	$thumb = preg_replace('/data:[^,]+,/i', '', $thumb); //ヘッダに「data:image/png;base64,」が付いているので、それは外す
	$thumb = base64_decode($thumb); //残りのデータはbase64エンコードされているので、デコードする
	$image = imagecreatefromstring($thumb); //まだ文字列の状態なので、画像リソース化
	imagesavealpha($image, TRUE); // 透明色の有効

	// random name
	$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
	$thumb_url	= '/s/thumbs/'.bin2hex($bytes).'.png'; // binaly to hex
	imagepng($image, '..' . $thumb_url); // 相対パス
}else{
	$thumb_url = NULL;
}


// Srcを取得
$stmt	= $dbh->prepare('SELECT "Src" FROM "Stage" WHERE "ID"=:project_sourceid');
$stmt->bindValue(":project_sourceid", $project['SourceStageID'], PDO::PARAM_INT);
$stmt->execute();
$stage	= $stmt->fetch(PDO::FETCH_ASSOC);

// ステージを作成
$path	= filter_input(INPUT_POST, 'path');
$title	= filter_input(INPUT_POST, 'title');
$explain= filter_input(INPUT_POST, 'explain');

$stmt	= $dbh->prepare('INSERT INTO "Stage" ("UserID","Mode","ProjectID","Path","Title","Explain","State","Thumbnail","SourceID","Src","Registered") VALUES(:userid,:replay,:projectid,:input_path,:input_title,:input_explain,:judging,:thumb_url,:project_sourceid,:stage_src,:gmt)');
$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
$stmt->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
$stmt->bindValue(":input_path", $path, PDO::PARAM_STR);
$stmt->bindValue(":input_title", $title, PDO::PARAM_STR);
$stmt->bindValue(":input_explain", $explain, PDO::PARAM_STR);
$stmt->bindValue(":judging", 'judging', PDO::PARAM_STR);
$stmt->bindValue(":thumb_url", $thumb_url, PDO::PARAM_STR);
$stmt->bindValue(":project_sourceid", $project['SourceStageID'], PDO::PARAM_INT);
$stmt->bindValue(":stage_src", $stage['Src'], PDO::PARAM_STR);
$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);
$flag 	= $stmt->execute();
if (!$flag) {
	exit('database-error');
}

// ステージIDをProjectに関連づける
$lastInsertId = $dbh->lastInsertId('Stage');
$stmt	= $dbh->prepare('UPDATE "Project" SET "PublishedStageID"=:lastinsertid WHERE "ID"=:projectid');
$stmt->bindValue(":lastinsertid", $lastInsertId, PDO::PARAM_INT);
$stmt->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
$stmt->execute();

echo implode(',', array($lastInsertId, $title));
exit;

?>
