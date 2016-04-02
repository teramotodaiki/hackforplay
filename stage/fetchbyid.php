<?php
/*
IDの配列を受け取り、対応するステージの情報を返す。
無効なIDは無視する
Input:	[id (,,,)] カンマ区切りのID , (attendance-token)
Output:	JSON:{information_of_stages} , parse-error
information_of_stages:
{
values : [
	id : ステージのID,
	title : タイトル,
	thumbnail : サムネイルのURL
	playcount : 現在のプレイ回数
](,,,[])
}
*/

require_once '../preload.php';

// IDを取得
$input_id 	= filter_input(INPUT_POST, 'id');
$stageid 	= array();
foreach (explode(',', $input_id) as $key => $value) {
	$item 	= intval($value);
	if ($item > 0) {
		array_push($stageid, $item);
	}
}

// ステージ情報を取得
$values = array();
$stmt 	= $dbh->prepare('SELECT "ID","Title","Thumbnail","Playcount" FROM "Stage" WHERE "ID"=:stageid');
foreach ($stageid as $key => $value) {
	$stmt->bindValue(":stageid", $value, PDO::PARAM_INT);
	$stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);

	if (!empty($result)) {
		$item 			= new stdClass();
		$item->id 		= $result['ID'];
		$item->title 	= $result['Title'];
		$item->thumbnail = $result['Thumbnail'];
		$item->playcount = $result['Playcount'];

		array_push($values, $item);
	}
}

// 結果を出力
$information_of_stages = new stdClass();
$information_of_stages->values = $values;
$json = json_encode($information_of_stages);

if ($json === FALSE) {
	exit('parse-error');
}

echo $json;

?>
