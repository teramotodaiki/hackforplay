<?php
/*
サインアップ直後のセッションでのみ、パスワードを変更する
Input:	password
Output:	no-session , not-immediately , update-failed , success
invalid-inputs:
{[inputs, (more inputs...)]}
*/

require_once '../preload.php';

try {

	session_start();
	$session_userid	= isset($_SESSION['UserID']) ? $_SESSION['UserID'] : NULL;

	// セッションを確認
	if (!isset($session_userid)) {
		exit('no-session');
	}
	// 登録直後か確認
	if(!isset($_SESSION['SignupImmediately'])){
		exit('not-immediately');
	}

	$password			= filter_input(INPUT_POST, 'password');
	if(strlen($password) < 8){
		array_push($invalid_inputs, 'password');
	}else{
		$hashed			= password_hash($password, PASSWORD_DEFAULT);
	}

	// Update password
	$stmt 	= $dbh->prepare('UPDATE "Account" SET "Hashed"=:hashed WHERE "UserID"=:userid');
	$stmt->bindValue(":hashed", $hashed, PDO::PARAM_INT);
	$stmt->bindValue(":userid", $session_userid, PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if (!$flag) {
		exit('update-failed');
	}

	// セッション変数を削除
	unset($_SESSION['SignupImmediately']);
	session_commit();

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
}
?>