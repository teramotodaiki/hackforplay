<?php
/*
ユーザーのパスワードを更新する。セッションと現在のパスワードが必要
Input:	current , password
Output:	no-session , invalid-password , incorrect-password , update-failed , success
*/

require_once '../preload.php';

// セッションからUserIDを取得
session_start();
if(!isset($_SESSION['UserID'])){
	exit('no-session');
}
$userid = $_SESSION['UserID'];
session_commit();

// Validation
$current = filter_input(INPUT_POST, 'current');
$password = filter_input(INPUT_POST, 'password');
if($password == FALSE || strlen($password) < 8){
	exit('invalid-password');
}

// パスワードを照会
try {
	$stmt 	= $dbh->prepare('SELECT "ID","Hashed" FROM "Account" WHERE "ID"=:userid AND "Type"=:hackforplay AND "State"=:connected');
	$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
	$stmt->bindValue(":hackforplay", 'hackforplay', PDO::PARAM_STR);
	$stmt->bindValue(":connected", 'connected', PDO::PARAM_STR);
	$stmt->execute();
	$account = $stmt->fetch(PDO::FETCH_ASSOC);
	if ($account == NULL || !password_verify($current, $account['Hashed'])) {
		exit('incorrect-password');
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// パスワードを更新
$hashed = password_hash($password, PASSWORD_DEFAULT);
try {
	$stmt 	= $dbh->prepare('UPDATE "Account" SET "Hashed"=:hashed WHERE "ID"=:account_id');
	$stmt->bindValue(":hashed", $hashed, PDO::PARAM_STR);
	$stmt->bindValue(":account_id", $account['ID'], PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if (!$flag) {
		exit('update-failed');
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

exit('success');

?>