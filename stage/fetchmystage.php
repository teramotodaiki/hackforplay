<?php
/*
セッションIDをもとに、自分が作ったステージを取得
Input:	start , length , (attendance-token)
Output:	no-session , parse-error , JSON:{information_of_stages}
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
		state : ステージの状態,
		published : 公開された日付,
		reject_reason : [(リジェクトされた理由),,,]
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

	if (!isset($session_userid)) {
		exit('no-session');
	}

	// ステージ一覧を取得
	// SQL Serverでは LIMIT 句が使えないので、一旦全データを取得している いずれ直すべき
	$result = array();
	$stmt	= $dbh->prepare('SELECT s."ID",s."UserID",s."Title",s."Thumbnail",s."SourceID",s."Playcount",s."Published",s."State","User"."Nickname","Stage"."Title" AS SourceTitle,"Stage"."Mode" FROM ("Stage" AS s LEFT OUTER JOIN "User" ON s."UserID"="User"."ID") LEFT OUTER JOIN "Stage" ON s."SourceID"="Stage"."ID" WHERE s."UserID"=:userid ORDER BY s."Published" DESC');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();

	for ($i=0; $i < $fetch_start; $i++) {
		$item	= $stmt->fetch();
	}
	for ($i = 0; $i < $max_fetch_length; $i++){
		$item	= $stmt->fetch(PDO::FETCH_ASSOC);
		if($item !== FALSE){
			array_push($result, $item);
		}else{
			break;
		}
	}

	foreach ($result as $key => $value) {
		$reason		= array();

		if ($value['State'] === 'rejected') {
			// リジェクトされた理由を取得
			$stmt	= $dbh->prepare('SELECT "Message" FROM "RejectReasonData" WHERE "ID" IN (SELECT "DataID" FROM "RejectReasonMap" WHERE "StageID"=:stage_id)');
			$stmt->bindValue(":stage_id", $value['ID'], PDO::PARAM_INT);
			$stmt->execute();
			$reason	= $stmt->fetchAll(PDO::FETCH_COLUMN);
		}
		$result[$key]['Reason']	= $reason;
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
		$item->state 	 	= $value['State'];
		$item->published 	= $value['Published'];
		$item->reject_reason= $value['Reason'];
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

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>