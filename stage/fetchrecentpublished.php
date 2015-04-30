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
	$stmt	= $dbh->prepare('SELECT s."ID",s."UserID",s."Title",s."Thumbnail",s."SourceID",s."Playcount",s."Published","User"."Nickname","Stage"."Title" FROM ("Stage" AS s LEFT OUTER JOIN "User" ON s."UserID"="User"."ID") LEFT OUTER JOIN "Stage" ON s."SourceID"="Stage"."ID" WHERE "Mode"=:replay AND "State"=:published ORDER BY "Published" DESC LIMIT :max_fetch_length');
	$stmt->bindValue(":replay", 'replay', PDO::PARAM_STR);
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$stmt->bindValue(":max_fetch_length", $max_fetch_length, PDO::PARAM_INT);
	$result = $dbh->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
	print_r($e);
	die();
}

// 配列のvalueを生成し、データを格納
$values = array();
foreach ($result as $key => $value) {
	$item 	= new stdClass();
	$item->id 			= $value['s.ID'];
	$item->author_id 	= $value['s.UserID'];
	$item->author_name 	= $value['User.Nickname'];
	$item->title 		= $value['s.Title'];
	$item->thumbnail 	= $value['s.Thumbnail'];
	$item->source_id 	= $value['s.SourceID'];
	$item->source_title	= $value['Stage.Title'];
	$item->playcount 	= $value['s.Playcount'];
	$item->published 	= $value['s.Published'];
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