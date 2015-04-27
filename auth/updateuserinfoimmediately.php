<?php
/*
サインアップ直後のセッションでのみ、ユーザーの情報・パスワードを変更する
NULLは許されない
Input:	age, gender, nickname , password
Output:	JSON:{invalid-inputs} , no-session , not-immediately , update-failed , success
invalid-inputs:
{[inputs, (more inputs...)]}
*/

require_once '../preload.php';

// Input value
$invalid_inputs = array();
$age = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT);
if($age == FALSE || $age < 0 || $age > 200){
	array_push($invalid_inputs, 'age');
}
$gender = filter_input(INPUT_POST, 'gender');
if($gender != "man" && $gender != "woman"){
	array_push($invalid_inputs, 'gender');
}
$nickname = filter_input(INPUT_POST, 'nickname');
if($nickname == FALSE){
	array_push($invalid_inputs, 'nickname');
}
$password 	= filter_input(INPUT_POST, 'password');
if(strlen($password) < 8){
	array_push($invalid_inputs, 'password');
}
$hashed = password_hash($password, PASSWORD_DEFAULT);

if(count($invalid_inputs) > 0){
	exit(json_encode($invalid_inputs));
}

// セッションを確認
session_start();
if (isset($_SESSION['UserID'])) {
	$userid = $_SESSION['UserID'];
} else {
	exit('no-session');
}
// 登録直後か確認
if(!isset($_SESSION['SignupImmediately'])){
	exit('not-immediately');
}

try {
	// Update password
	$stmt 	= $dbh->prepare('UPDATE "Account" SET "Hashed"=:hashed WHERE "UserID"=:userid');
	$stmt->bindValue(":hashed", $hashed, PDO::PARAM_INT);
	$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if (!$flag) {
		exit('update-failed');
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

try {
	// Update All
	$stmt 	= $dbh->prepare('UPDATE "User" SET "Age"=:age, "Gender"=:gender, "Nickname"=:nickname WHERE "ID"=:userid');
	$stmt->bindValue(":age", $age, PDO::PARAM_INT);
	$stmt->bindValue(":gender", $gender, PDO::PARAM_STR);
	$stmt->bindValue(":nickname", $nickname, PDO::PARAM_STR);
	$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if (!$flag) {
		exit('update-failed');
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

// セッション変数を削除
unset($_SESSION['SignupImmediately']);
session_commit();

exit('success');
 ?>