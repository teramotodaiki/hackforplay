<?php
/*
管理者用API。与えられたIDに該当するステージをリジェクトする。そのステージのステートは問わない。ただしデータは削除されない
Input:	stage_id , reasons:JSON , (attendance-token)
Ouput:	failed , success
*/

require_once '../preload.php';

try {

	$stage_id 	= filter_input(INPUT_POST, 'stage_id', FILTER_VALIDATE_INT);
	if ($stage_id === FALSE || $stage_id === NULL) {
		exit('failed');
	}

	$stmt	= $dbh->prepare('SELECT "UserID","Title","Thumbnail" FROM "Stage" WHERE "ID"=:stage_id');
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$stmt->execute();
	$stage	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (empty($stage)) {
		exit('failed');
	}

	// リジェクトの理由
	$reasons_json	= filter_input(INPUT_POST, 'reasons');
	$reasons		= json_decode($reasons_json);
	if ($reasons && !empty($reasons)) {
		$registered		= gmdate("Y-m-d H:i:s") . date("P");
		$placeHolder	= array_fill(0, count($reasons), "($stage_id,?,'$registered')");
		$stmt			= $dbh->prepare('INSERT INTO "RejectReasonMap" ("StageID","DataID","Registered") VALUES '
			. implode(',', $placeHolder));
		foreach ($reasons as $key => $value) {
			$stmt->bindValue($key + 1, $value, PDO::PARAM_INT);
		}
		$flag	= $stmt->execute();
		if (!$flag) {
			exit('failed');
		}
	}

	$stmt	= $dbh->prepare('UPDATE "Stage" SET "State"=:rejected WHERE "ID"=:stage_id');
	$stmt->bindValue(":rejected", 'rejected', PDO::PARAM_STR);
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('failed');
	}

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
		$stmt	= $dbh->prepare('INSERT INTO "NotificationDetail" ("NotificationID","Data","KeyString") VALUES(:id_1,:stageid,:stage),(:id_2,:rejected,:judged)');
		$stmt->bindValue(":id_1", $NotificationID, PDO::PARAM_INT);
		$stmt->bindValue(":id_2", $NotificationID, PDO::PARAM_INT);
		$stmt->bindValue(":stageid", $stage_id, PDO::PARAM_INT);
		$stmt->bindValue(":stage", 'stage', PDO::PARAM_STR);
		$stmt->bindValue(":rejected", 'rejected', PDO::PARAM_INT);
		$stmt->bindValue(":judged", 'judged', PDO::PARAM_STR);
		$stmt->execute();
	}

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>