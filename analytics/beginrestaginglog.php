<?php
/*
Restaging中のロギングを開始する
Input:	(StageID) , (Mode)
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