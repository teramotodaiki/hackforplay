<?php
/*
サインアップ直後のセッションでのみ、ユーザーの情報・パスワードを変更する
NULLは許されない
Input:	gender, nickname , password , birthday , experience_days , timezone_name , timezone_offset
Output:	JSON:{invalid-inputs} , no-session , not-immediately , update-failed , success
invalid-inputs:
{[inputs, (more inputs...)]}
*/

require_once '../preload.php';

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

// Input value
$gender				= filter_input(INPUT_POST, 'gender');
if($gender !== "man" && $gender !== "woman"){
	array_push($invalid_inputs, 'gender');
}
$nickname			= filter_input(INPUT_POST, 'nickname');
if($nickname === NULL){
	array_push($invalid_inputs, 'nickname');
}
$password			= filter_input(INPUT_POST, 'password');
if(strlen($password) < 8){
	array_push($invalid_inputs, 'password');
}else{
	$hashed			= password_hash($password, PASSWORD_DEFAULT);
}
$birthday			= filter_input(INPUT_POST, 'birthday');
if ($birthday === NULL || date_create_from_format('Y-m-d', $birthday) === FALSE) {
	array($invalid_inputs, 'birth_year');
}
$experience_days	= filter_input(INPUT_POST, 'experience_days', FILTER_VALIDATE_INT);
if ($experience_days === NULL || $experience_days === FALSE) {
	array($invalid_inputs, 'experience_days');
}
$timezone_name		= filter_input(INPUT_POST, 'timezone_name');
$timezone_offset	= filter_input(INPUT_POST, 'timezone_offset', FILTER_VALIDATE_INT);
if ($timezone_name === NULL ||	$timezone_offset === NULL || $timezone_offset === FALSE) {
	array($invalid_inputs, 'timezone');
}

if(count($invalid_inputs) > 0){
	exit(json_encode($invalid_inputs));
}

$accept_language	= $_SERVER['HTTP_ACCEPT_LANGUAGE'];
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
	$stmt 	= $dbh->prepare('UPDATE "User" SET "Gender"=:gender, "Nickname"=:nickname, "Birthday"=:birthday, "ExperienceDays"=:experience_days, "TimezoneName"=:timezone_name, "TimezoneOffset"=:timezone_offset, "AcceptLanguage"=:accept_language	WHERE "ID"=:userid');
	$stmt->bindValue(":gender", $gender, PDO::PARAM_STR);
	$stmt->bindValue(":nickname", $nickname, PDO::PARAM_STR);
	$stmt->bindValue(":birthday", $birthday, PDO::PARAM_STR);
	$stmt->bindValue(":experience_days", $experience_days, PDO::PARAM_INT);
	$stmt->bindValue(":timezone_name", $timezone_name, PDO::PARAM_STR);
	$stmt->bindValue(":timezone_offset", $timezone_offset, PDO::PARAM_INT);
	$stmt->bindValue(":accept_language", $accept_language, PDO::PARAM_STR);
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