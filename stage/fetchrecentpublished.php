<?php
/*
最大$max_fetch_length件までのリミット値を受け取り、その個数だけの、すでに公開されたステージを、新しいものから順に出力する
Input:	start , length , filter , (attendance-token)
Output:	JSON:{information_of_stages} , parse-error
information_of_stages:
{
values : [
	id : ステージのID,
	author_id : null または 制作者のユーザーID,
	author_name : null または 制作者のニックネーム,
	title : タイトル,
	thumbnail : サムネイルのURL,
	source_id : 改造元ステージのID,
	source_title : 改造元ステージの名前,
	source_mode : 改造元ステージのMode (official, replay)
	playcount : 現在のプレイ回数,
	(LogCount : PlayLogのCOUNTを格納した連想配列)
	published : 公開された日付
](,,,[])
}
*/

require_once '../preload.php';

// 最大値を設定
$max_fetch_length 	= 100;
$input_max_fetch_length = filter_input(INPUT_POST, 'length', FILTER_VALIDATE_INT);
if ($input_max_fetch_length !== FALSE && $input_max_fetch_length !== NULL) {
	$max_fetch_length 	= min($max_fetch_length, $input_max_fetch_length);
}
$fetch_start		= filter_input(INPUT_POST, 'start', FILTER_VALIDATE_INT);
if (!$fetch_start) {
	$fetch_start	= 0;
}

// ステージ一覧を取得
// SQL Serverでは LIMIT 句が使えないので、一旦全データを取得している いずれ直すべき
$stmt = $dbh->prepare('SELECT "ID" FROM "Stage" WHERE "Mode"=:replay AND "State"=:published ORDER BY "Published" DESC');
$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
$stmt->execute();
$result	= array_slice($stmt->fetchAll(PDO::FETCH_ASSOC), $fetch_start, $max_fetch_length);

// ステージの詳細を取得
$stmt = $dbh->prepare('SELECT * FROM "Stage" WHERE "ID"=:id');
foreach ($result as $key => $value) {
	$stmt->bindValue(':id', $value['ID'], PDO::PARAM_INT);
	$stmt->execute();
	$result[$key]['Stage'] = $stmt->fetch(PDO::FETCH_ASSOC);
}

// ユーザーの詳細を取得
$stmt = $dbh->prepare('SELECT "Nickname" FROM "User" WHERE "ID"=:userid');
foreach ($result as $key => $value) {
	$stmt->bindValue(':userid', $value['Stage']['UserID'], PDO::PARAM_INT);
	$stmt->execute();
	$result[$key]['User'] = $stmt->fetch(PDO::FETCH_ASSOC);
}

// ソースステージの詳細を取得
$stmt = $dbh->prepare('SELECT "Title","Mode" FROM "Stage" WHERE "ID"=:sourceid');
foreach ($result as $key => $value) {
	$stmt->bindValue(':sourceid', $value['Stage']['SourceID'], PDO::PARAM_INT);
	$stmt->execute();
	$result[$key]['Source']	= $stmt->fetch(PDO::FETCH_ASSOC);
}

// PlayLogからclearrateを算出する [高負荷]
$stmt = $dbh->prepare('SELECT COUNT(*) AS "All",COUNT("Cleared") AS "Cleared" FROM "PlayLog" WHERE "StageID"=:stage_id AND "Registered">:lastmonth');
$lastmonth = date('Y-m-d H:i:s', strtotime('-1 month'));
foreach ($result as $key => $value) {
	$stmt->bindValue(':stage_id', $value['ID']);
	$stmt->bindValue(':lastmonth', $lastmonth);
	$stmt->execute();
	$result[$key]['LogCount'] = $stmt->fetch(PDO::FETCH_ASSOC);
}

// 配列のvalueを生成し、データを格納
$values = array();
foreach ($result as $key => $value) {
	$item 	= new stdClass();
	$item->id 			= $value['ID'];
	$item->author_id 	= $value['Stage']['UserID'];
	$item->author_name 	= $value['User']['Nickname'];
	$item->title 		= $value['Stage']['Title'];
	$item->thumbnail 	= $value['Stage']['Thumbnail'];
	$item->source_id 	= $value['Stage']['SourceID'];
	$item->source_title	= $value['Source']['Title'];
	$item->source_mode	= $value['Source']['Mode'];
	$item->playcount 	= $value['Stage']['Playcount'];
	$item->LogCount = $value['LogCount'];
	$item->published 	= $value['Stage']['Published'];
	array_push($values, $item);
}

// 出力
$information_of_stages = new stdClass();
$information_of_stages->values = $values;
$json = json_encode($information_of_stages);

if ($json === FALSE) {
	exit('parse-error');
}

echo $json;

?>
