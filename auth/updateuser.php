<?php
/*
ユーザーの情報を更新する
Input:	nickname , (attendance-token)
Output: no-session, success
*/

require_once '../preload.php';

session_start();
$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
session_commit();

if(!isset($session_userid)){
	exit('no-session');
}

// Input value
$nickname = filter_input(INPUT_POST, 'nickname');

// Update Nickname
if ($nickname !== NULL) {
	$stmt 	= $dbh->prepare('UPDATE "User" SET "Nickname"=:nickname WHERE "ID"=:userid');
	$stmt->bindValue(":nickname", $nickname, PDO::PARAM_STR);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->execute();
}

exit('success');

?>
