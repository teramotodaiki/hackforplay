<?php
/*
ユーザーのパスワードを更新する。セッションと現在のパスワードが必要
Input:	current , password , (attendance-token)
Output:	no-session , invalid-password , incorrect-password , update-failed , success
*/

require_once '../preload.php';

try {

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;
	session_commit();

	if(!isset($session_userid)){
		exit('no-session');
	}

	// Validation
	$current = filter_input(INPUT_POST, 'current');
	$password = filter_input(INPUT_POST, 'password');
	if($password === FALSE || strlen($password) < 8){
		exit('invalid-password');
	}

	// パスワードを照会
	$stmt 	= $dbh->prepare('SELECT "ID","Hashed" FROM "Account" WHERE "UserID"=:userid AND "Type"=:hackforplay AND "State"=:connected');
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$stmt->bindValue(":hackforplay", 'hackforplay', PDO::PARAM_STR);
	$stmt->bindValue(":connected", 'connected', PDO::PARAM_STR);
	$stmt->execute();
	$account = $stmt->fetch(PDO::FETCH_ASSOC);
	if ($account === NULL || !password_verify($current, $account['Hashed'])) {
		exit('incorrect-password');
	}

	// パスワードを更新
	$hashed = password_hash($password, PASSWORD_DEFAULT);
	$stmt 	= $dbh->prepare('UPDATE "Account" SET "Hashed"=:hashed WHERE "UserID"=:account_id');
	$stmt->bindValue(":hashed", $hashed, PDO::PARAM_STR);
	$stmt->bindValue(":account_id", $account['ID'], PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if (!$flag) {
		exit('update-failed');
	}

	exit('success');

} catch (Exception $e) {
	Rollbar::report_exception($e);
	die();
}
?>
