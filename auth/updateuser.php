<?php
/*
ユーザーの情報を更新する
Input:	nickname , timezone_name , timezone_offset
Output: no-session, success
*/

require_once '../preload.php';

try {

	if(!isset($session_userid)){
		exit('no-session');
	}

	// Input value
	$nickname = filter_input(INPUT_POST, 'nickname');
	$timezone_name = filter_input(INPUT_POST, 'timezone_name');
	$timezone_offset = filter_input(INPUT_POST, 'timezone_offset', FILTER_VALIDATE_INT);
	if ($timezone_offset === FALSE) {
		$timezone_offset = NULL;
	}

	// Update Nickname
	if ($nickname !== NULL) {
		$stmt 	= $dbh->prepare('UPDATE "User" SET "Nickname"=:nickname WHERE "ID"=:userid');
		$stmt->bindValue(":nickname", $nickname, PDO::PARAM_STR);
		$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
		$stmt->execute();
	}
	if ($timezone_name !== NULL && $timezone_offset !== NULL) {
		$stmt 	= $dbh->prepare('UPDATE "User" SET "TimezoneName"=:timezone_name,"TimezoneOffset"=:timezone_offset WHERE "ID"=:userid');
		$stmt->bindValue(":timezone_name", $timezone_name, PDO::PARAM_STR);
		$stmt->bindValue(":timezone_offset", $timezone_offset, PDO::PARAM_INT);
		$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
		$stmt->execute();
	}

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>