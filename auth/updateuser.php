<?php
/*
ユーザーの情報を更新する
Input:	Nickname
Output: no-session, success
*/

require_once '../preload.php';

if(!isset($session_userid)){
	exit('no-session');
}

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
		$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
		$stmt->execute();
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

exit('success');
 ?>