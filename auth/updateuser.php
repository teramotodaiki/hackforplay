<?php
/*
ユーザーの情報を更新する
Input:	Age, Gender, Nickname
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
$age = filter_input(INPUT_POST, 'age', FILTER_VALIDATE_INT);
if($age == FALSE || $age < 0 || $age > 200){
	$age = NULL;
}
$gender = filter_input(INPUT_POST, 'gender');
if($gender != "man" && $gender != "woman"){
	$gender = NULL;
}
$nickname = filter_input(INPUT_POST, 'nickname');
if($nickname == FALSE){
	$nickname = NULL;
}

try {
	// Update Age
	if ($age != NULL) {
		$stmt 	= $dbh->prepare('UPDATE "User" SET "Age"=:age WHERE "ID"=:userid');
		$stmt->bindValue(":age", $age, PDO::PARAM_INT);
		$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
		$stmt->execute();
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

try {
	echo "update gener, ";
	var_dump($gender);
	var_dump($_POST['gender']);
	// Update Gender
	if ($gender != NULL) {
		$stmt 	= $dbh->prepare('UPDATE "User" SET "Gender"=:gender WHERE "ID"=:userid');
		$stmt->bindValue(":gender", $gender, PDO::PARAM_STR);
		$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
		$stmt->execute();
	}
} catch (PDOException $e) {
	print_r($e);
	die();
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