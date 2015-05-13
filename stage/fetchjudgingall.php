<?php
/*
judgingステートの全てのステージを、投稿時刻が早い順に取得する。
Output: parse-error , JSON:{information_of_stages}
information_of_stages:
	values : [
		id : ステージのID,
		author_id : null または 制作者のユーザーID,
		author_name : null または 制作者のニックネーム,
		title : タイトル,
		thumbnail : サムネイルのURL,
		source_id : 改造元ステージのID,
		source_title : 改造元ステージの名前,
		source_mode : 改造元ステージのMode (official, replay)
		state : ステージの状態,
		registered : 投稿された日付
	](,,,[])
}
*/

require_once '../preload.php';

// ステージ一覧を取得
$result = array();
try {
	$stmt	= $dbh->prepare('SELECT s."ID",s."UserID",s."Title",s."Thumbnail",s."SourceID",s."Registered",s."State","User"."Nickname","Stage"."Title" AS SourceTitle,"Stage"."Mode" FROM ("Stage" AS s LEFT OUTER JOIN "User" ON s."UserID"="User"."ID") LEFT OUTER JOIN "Stage" ON s."SourceID"="Stage"."ID" WHERE s."State"=:judging ORDER BY s."Registered" DESC');
	$stmt->bindValue(":judging", 'judging', PDO::PARAM_STR);
	$stmt->execute();
	$result	= $stmt->fetchAll(PDO::FETCH_ASSOC);

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
	$item->source_mode	= $value['Mode'];
	$item->state 	 	= $value['State'];
	$item->registered	= $value['Registered'];
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