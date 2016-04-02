<?php
/*
HackforPlayアカウント情報が正しいかどうかを判別し、あっていればStateをconnectedにする
Input:	mail , Hash前のパスワード
Output:	invalid-email , already-confirmed , incorrect-password , valid-but-failed , success
*/

require_once '../preload.php';

$password = filter_input(INPUT_POST, "password");
$email 	= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if($email === FALSE){
	exit('invalid-email');
}

// disconnected でないアカウント情報をすべて取得
$stmt 	= $dbh->prepare('SELECT "ID","UserID","Hashed","State" FROM "Account" WHERE "Email"=:email AND "State"!=:disconnected AND "Type"=:hackforplay');
$stmt->bindValue(":email", $email);
$stmt->bindValue(":disconnected", "disconnected");
$stmt->bindValue(":hackforplay", "hackforplay");
$stmt->execute();
$result	= $stmt->fetchAll(PDO::FETCH_ASSOC);

// すでに connected なアカウントがある場合
foreach ($result as $key => $value) {
	if ($value["State"] === 'connected') {
		exit('already-confirmed');
	}
}

// いずれかに整合するなら、Accountを保存する
$confirmed = NULL;
foreach ($result as $key => $value) {
	if(password_verify($password, $value['Hashed'])){
		$confirmed = $value;
		break;
	}
}
if($confirmed === NULL){
	exit("incorrect-password");
}

// セッションを作成
session_start();
$_SESSION['UserID'] = $confirmed['UserID'];
$_SESSION['SignupImmediately'] = 'immediately';

session_commit();

// アカウントのStateをconnectedに
$stmt	= $dbh->prepare('UPDATE "Account" SET "State"=:connected WHERE "ID"=:confirmed_id');
$stmt->bindValue(":connected", "connected");
$stmt->bindValue("confirmed_id", $confirmed['ID'], PDO::PARAM_INT);
$flag 	= $stmt->execute();
if(!$flag){
	exit("valid-but-failed");
}

// 同じメールアドレスで作られたHackforPlayアカウントのすべての unconfirmed なアカウントを disconnected に
$stmt	= $dbh->prepare('UPDATE "Account" SET "State"=:disconnected WHERE "Type"=:hackforplay AND "email"=:email AND "State"=:unconfirmed');
$stmt->bindValue(":disconnected", "disconnected");
$stmt->bindValue(":hackforplay", "hackforplay");
$stmt->bindValue(":email", $email);
$stmt->bindValue(":unconfirmed", "unconfirmed");
$stmt->execute();

// ユーザーに関連付けられたペーパーログインアカウントを disconnected に
$stmt	= $dbh->prepare('UPDATE "Account" SET "State"=:disconnected WHERE "Type"=:paperlogin AND "UserID"=:userid');
$stmt->bindValue(":disconnected", "disconnected", PDO::PARAM_STR);
$stmt->bindValue(":paperlogin", "paperlogin", PDO::PARAM_STR);
$stmt->bindValue(":userid", $confirmed['UserID'], PDO::PARAM_INT);
$stmt->execute();

exit("success");

?>
