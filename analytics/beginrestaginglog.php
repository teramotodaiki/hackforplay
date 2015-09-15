<?php
/*
Restaging中のロギングを開始する
Input:	(StageID) , (Mode) , (Report , (Level))
Output:	error , {token}
*/

try {

	require_once '../preload.php';

	$stage_id	= filter_input(INPUT_POST, 'stage_id', FILTER_VALIDATE_INT);
	$mode		= filter_input(INPUT_POST, 'mode');

	date_default_timezone_set('GMT');
	$gmtime	= time();

	// Tokenを生成
	$bytes 	= openssl_random_pseudo_bytes(16); // 16bytes (32chars)
	$token	= bin2hex($bytes); // binaly to hex

	// UserIDを取得
	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	$stmt	= $dbh->prepare('INSERT INTO "RestagingLog" ("Token","UserID","StageID","Mode","BeginUnixTime","LastUnixTime") VALUES (:token,:session_userid,:stage_id,:mode,:gmtime1,:gmtime2)');
	$stmt->bindValue(":token", $token, PDO::PARAM_STR);
	$stmt->bindValue(":session_userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
	$stmt->bindValue(":mode", $mode, PDO::PARAM_STR);
	$stmt->bindValue(":gmtime1", $gmtime, PDO::PARAM_INT);
	$stmt->bindValue(":gmtime2", $gmtime, PDO::PARAM_INT);
	$flag	= $stmt->execute();

	// Restage Achievements Report
	$report		= filter_input(INPUT_POST, 'report', FILTER_VALIDATE_BOOLEAN);
	$level		= filter_input(INPUT_POST, 'level', FILTER_VALIDATE_INT);
	if ($report && $session_userid) {
		// 報告義務がある場合
		if ($mode === 'quest' && $level) {
			// クエストのRestage
			// Level-Quest-QuestUserMap => Update (Mapがなければ無視)
			$stmt	= $dbh->prepare('UPDATE "QuestUserMap" SET "Restaged"=:true WHERE "UserID"=:userid AND "QuestID"=(SELECT "QuestID" FROM "Level" WHERE "ID"=:level_id)');
			$stmt->bindValue(":true", TRUE, PDO::PARAM_BOOL);
			$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
			$stmt->bindValue(":level_id", $level, PDO::PARAM_INT);
			$flag = $stmt->execute();

		} elseif ($mode === 'official') {
			// キットのRestage
			// StageID-Pavilion-PavilionUserMap => Update (Mapがなければ or Certifyされていなければ,無視)
			$stmt	= $dbh->prepare('UPDATE "PavilionUserMap" SET "Restaged"=:true1 WHERE "UserID"=:userid AND "Certified"=:true2 AND "PavilionID"=(SELECT "ID" FROM "Pavilion" WHERE "KitStageID"=:stage_id)');
			$stmt->bindValue(":true1", TRUE, PDO::PARAM_BOOL);
			$stmt->bindValue(":true2", TRUE, PDO::PARAM_BOOL);
			$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
			$stmt->bindValue(":stage_id", $stage_id, PDO::PARAM_INT);
			$stmt->execute();
		}
	}

	if (!$flag) {
		exit('error');
	}

	exit($token);

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}

?>