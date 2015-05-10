<?php
/*
ユーザーの情報を更新する
Input:	Nickname
Output: no-session, success
*/

require_once '../preload.php';

// セッションからUserIDを取得
session_start();
if(!isset($_SESSION['UserID'])){
	exit('no-session');
}
$userid = $_SESSION['UserID'];
session_commit();

// Input value
$nickname = filter_input(INPUT_POST, 'nickname');
if($nickname === FALSE){
	$nickname = NULL;
}

try {
	// Update Nickname
	if ($nickname != NULL) {
		$stmt 	= $dbh->prepare('UPDATE "User" SET "Nickname"=:nickname WHERE "ID"=:userid');
		$stmt->bindValue(":nickname", $nickname, PDO::PARAM_STR);
		$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
		$stmt->execute();
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

exit('success');
 ?>