<?php
/*
管理者用API。与えられたIDに該当する審査中のステージを承認し公開する。
Input:	stage_id , (attendance-token)
Ouput:	failed , success
*/

require_once '../preload.php';

try {

	$stage_id 	= filter_input(INPUT_POST, 'stage_id', FILTER_VALIDATE_INT);
	if ($stage_id === FALSE || $stage_id === NULL) {
		exit('failed');
	}

	$stmt	= $dbh->prepare('SELECT "UserID","Title","Thumbnail" FROM "Stage" WHERE "ID"=:stage_id AND "State"=:judging');
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$stmt->bindValue(":judging", 'judging', PDO::PARAM_STR);
	$stmt->execute();
	$stage	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (empty($stage)) {
		exit('failed');
	}

	$stmt	= $dbh->prepare('UPDATE "Stage" SET "State"=:published,"Published"=:gmt WHERE "ID"=:stage_id');
	$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . date("P"), PDO::PARAM_STR); // サーバー時刻
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('failed');
	}

	try {

	if ($stage['UserID']) {
		// 通知を生成
		$stmt	= $dbh->prepare('INSERT INTO "Notification" ("UserID","State","Type","Thumbnail","LinkedURL","MakeUnixTime") VALUES(:author_id,:unread,:judged,:thumb_url,:mypage,:time)');
		$stmt->bindValue(":author_id", $stage['UserID'], PDO::PARAM_INT);
		$stmt->bindValue(":unread", 'unread', PDO::PARAM_STR);
		$stmt->bindValue(":judged", 'judged', PDO::PARAM_STR);
		$stmt->bindValue(":thumb_url", $stage['Thumbnail'], PDO::PARAM_STR);
		$stmt->bindValue(":mypage", '/m/', PDO::PARAM_STR);
		date_default_timezone_set('GMT');
		$stmt->bindValue(":time", time(), PDO::PARAM_STR);
		$stmt->execute();
		$NotificationID	= $dbh->lastInsertId('Notification');

		// ステージ名と結果を追加
		$stmt	= $dbh->prepare('INSERT INTO "NotificationDetail" ("NotificationID","Data","KeyString") VALUES(:id_1,:stageid,:stage),(:id_2,:published,:judged)');
		$stmt->bindValue(":id_1", $NotificationID, PDO::PARAM_INT);
		$stmt->bindValue(":id_2", $NotificationID, PDO::PARAM_INT);
		$stmt->bindValue(":stageid", $stage_id, PDO::PARAM_STR);
		$stmt->bindValue(":stage", 'stage', PDO::PARAM_STR);
		$stmt->bindValue(":published", 'published', PDO::PARAM_STR);
		$stmt->bindValue(":judged", 'judged', PDO::PARAM_STR);
		$stmt->execute();
	}

	} catch (PDOException $e) {
		var_dump($e);
		exit;
	}

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>