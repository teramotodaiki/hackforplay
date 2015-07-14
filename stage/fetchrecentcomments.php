<?php
/*
最大$max_fetch_length件までのリミット値を受け取り、その個数だけの、publishedなコメントを、新しいものから順に出力する
Input:	start , length , (attendance-token)
Output:	JSON:{information_of_comments} , parse-error
information_of_comments:
{
	values : [
		ID : このコメントのID,
		StageID : コメントしたステージのID,
		Message : コメントの内容,
		Thumbnail : コメントのサムネイル画像のURL,
		Registered : コメントをした日時(GMT+Timezone)
		Tags : [
			IdentifierString : タグの識別子
			DisplayString : タグをラベルとして表示する場合の文字
			LabelColor : タグをラベルとして表示する場合の背景色
		](,,,[])
	](,,,[])
}
*/

require_once '../preload.php';

try {

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
	$result = array();
	$stmt	= $dbh->prepare('SELECT "ID","StageID","Message","Thumbnail","Registered" FROM "CommentData" WHERE "State" IN (:published, :rejected) ORDER BY "Registered" DESC');
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
	$stmt->execute();

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

	// タグのリストを取得
	$stmt			= $dbh->prepare('SELECT "ID","IdentifierString","DisplayString","LabelColor" FROM "StageTagData"');
	$stmt->execute();
	$tag_value_list	= $stmt->fetchAll(PDO::FETCH_GROUP | PDO::FETCH_ASSOC);

	// $result にタグの情報を付加（関連付け）
	$stmt	= $dbh->prepare('SELECT "TagID" from "StageTagMap" WHERE "CommentID"=:comment_id');
	foreach ($result as $key => $value) {

		$stmt->bindValue(":comment_id", $value['ID'], PDO::PARAM_INT);
		$stmt->execute();
		$tag_id_list			= $stmt->fetchAll(PDO::FETCH_COLUMN, 0);

		$result[$key]['Tags']	= array();
		foreach ($tag_id_list as $index => $tag_id) {
			array_push($result[$key]['Tags'], isset($tag_value_list[$tag_id]) ? $tag_value_list[$tag_id][0] : array());
		}
	}

	// 出力
	$information_of_stages = new stdClass();
	$information_of_stages->values = $result;
	$json = json_encode($information_of_stages);

	if ($json === FALSE) {
		exit('parse-error');
	}

	echo $json;

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>