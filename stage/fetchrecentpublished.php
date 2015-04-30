<?php
/*
最大$max_fetch_length件までのリミット値を受け取り、その個数だけの、すでに公開されたステージを、新しいものから順に出力する
Input:	length
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
		playcount : 現在のプレイ回数,
		published : 公開された日付
	](,,,[])
}
*/
// 最大値を設定
$max_fetch_length 	= 15;
$input_max_fetch_length = filter_input(INPUT_POST, 'length', FILTER_VALIDATE_INT);
if ($input_max_fetch_length != FALSE && $input_max_fetch_length != NULL) {
	$max_fetch_length 	= min($max_fetch_length, $input_max_fetch_length);
}

require_once '../preload.php';

// ステージ一覧を取得
try {
	$stmt	= $dbh->prepare('SELECT s."ID",s."UserID",s."Title",s."Thumbnail",s."SourceID",s."Playcount",s."Published","User"."Nickname","Stage"."Title" AS SourceTitle FROM ("Stage" AS s LEFT OUTER JOIN "User" ON s."UserID"="User"."ID") LEFT OUTER JOIN "Stage" ON s."SourceID"="Stage"."ID" WHERE s."Mode"=:replay AND s."State"=:published ORDER BY "Published" DESC LIMIT :max_fetch_length');
	$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$stmt->bindValue(":max_fetch_length", $max_fetch_length, PDO::PARAM_INT);
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
	print_r($e);
	die();
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
	$item->playcount 	= $value['Playcount'];
	$item->published 	= $value['Published'];
	array_push($values, $item);
}

// 出力
$information_of_stages = new stdClass();
$information_of_stages->values = $values;
$json = json_encode($information_of_stages);

if ($json == FALSE) {
	exit('parse-error');
}

echo $json;

?>