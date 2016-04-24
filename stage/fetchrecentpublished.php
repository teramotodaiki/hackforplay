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

// ステージ一覧を取得 (フィルターなし)
// SQL Serverでは LIMIT 句が使えないので、一旦全データを取得している いずれ直すべき
$stmt	= $dbh->prepare('SELECT s."ID",s."UserID",s."Title",s."Thumbnail",s."SourceID",s."Playcount",s."Published","User"."Nickname","Stage"."Title" AS SourceTitle,"Stage"."Mode" FROM ("Stage" AS s LEFT OUTER JOIN "User" ON s."UserID"="User"."ID") LEFT OUTER JOIN "Stage" ON s."SourceID"="Stage"."ID" WHERE s."Mode"=:replay AND s."State"=:published ORDER BY "Published" DESC');
$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
$stmt->execute();

$result = array();
for ($i=0; $i < $fetch_start; $i++) {
	$item	= $stmt->fetch();
}
for ($i = 0; $i < $max_fetch_length; $i++){
	$item	= $stmt->fetch(PDO::FETCH_ASSOC);
	if($item != NULL){
		array_push($result, $item);
	}else{
		break;
	}
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
	$item->author_id 	= $value['UserID'];
	$item->author_name 	= $value['Nickname'];
	$item->title 		= $value['Title'];
	$item->thumbnail 	= $value['Thumbnail'];
	$item->source_id 	= $value['SourceID'];
	$item->source_title	= $value['SourceTitle'];
	$item->source_mode	= $value['Mode'];
	$item->playcount 	= $value['Playcount'];
	$item->LogCount = $value['LogCount'];
	$item->published 	= $value['Published'];
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
