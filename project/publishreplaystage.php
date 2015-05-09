<?php
/*
トークンのみからプロジェクトの情報を取得し、セッションのUserIDでステージを投稿する
Input:	token , thumb , path , title
Output:	no-session , invalid-token , already-published , database-error , success
*/

require_once '../preload.php';

// セッションを取得
session_start();
if (!isset($_SESSION['UserID'])) {
	exit('no-session');
}
$userid = $_SESSION['UserID'];
session_commit();

$timezone = filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
if($timezone === FALSE || $timezone === NULL){
	$timezone = '+00:00';
}

// プロジェクト情報を取得
$token = filter_input(INPUT_POST, 'token');
if($token == NULL || $token == FALSE){
	exit('invalid-token');
}
try {
	$stmt	= $dbh->prepare('SELECT "ID","SourceStageID","PublishedStageID" FROM "Project" WHERE "Token"=:token');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->execute();
	$project = $stmt->fetch(PDO::FETCH_ASSOC);
	if($project == NULL){
		exit('invalid-token');
	}elseif ($project['PublishedStageID'] != NULL) {
		exit('already-published');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// サムネイルを作成
$thumb	= filter_input(INPUT_POST, 'thumb');

$thumb = preg_replace('/data:[^,]+,/i', '', $thumb); //ヘッダに「data:image/png;base64,」が付いているので、それは外す
$thumb = base64_decode($thumb); //残りのデータはbase64エンコードされているので、デコードする
$image = imagecreatefromstring($thumb); //まだ文字列の状態なので、画像リソース化
imagesavealpha($image, TRUE); // 透明色の有効
// random name
$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
$thumb_url	= '/s/thumbs/'.bin2hex($bytes).'.png'; // binaly to hex
imagepng($image, '..' . $thumb_url); // 相対パス

// ステージを作成
$path	= filter_input(INPUT_POST, 'path');
$title	= filter_input(INPUT_POST, 'title');
try{
	$stmt	= $dbh->prepare('INSERT INTO "Stage" ("UserID","Mode","ProjectID","Path","Title","State","Thumbnail","SourceID","Registered") VALUES(:userid,:replay,:projectid,:input_path,:input_title,:judging,:thumb_url,:project_sourceid,:gmt)');
	$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
	$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
	$stmt->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
	$stmt->bindValue(":input_path", $path, PDO::PARAM_STR);
	$stmt->bindValue(":input_title", $title, PDO::PARAM_STR);
	$stmt->bindValue(":judging", 'judging', PDO::PARAM_STR);
	$stmt->bindValue(":thumb_url", $thumb_url, PDO::PARAM_STR);
	$stmt->bindValue(":project_sourceid", $project['SourceStageID'], PDO::PARAM_INT);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone, PDO::PARAM_STR);
	$flag 	= $stmt->execute();
	if (!$flag) {
		exit('database-error');
	}
}catch(PDOException $e) {
	print_r($e);
	die();
}

// ステージIDをProjectに関連づける
try {
	$stmt	= $dbh->prepare('UPDATE "Project" SET "PublishedStageID"=:lastinsertid WHERE "ID"=:projectid');
	$stmt->bindValue(":lastinsertid", $dbh->lastInsertId('Stage'), PDO::PARAM_INT);
	$stmt->bindValue(":projectid", $project['ID'], PDO::PARAM_INT);
	$stmt->execute();

} catch (PDOException $e) {
	print_r($e);
	die();
}

exit('success');
?>