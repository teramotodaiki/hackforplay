<?php
/*
HackforPlayアカウント情報が正しいかどうかを判別し、あっていればStateをconnectedにする
Input:	mail , Hash前のパスワード
Output:	invalid-mail , invalid-password , valid-but-failed , success
*/

require_once '../preload.php';

$password = filter_input(INPUT_POST, "password");
$email 	= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if($email == FALSE){
	exit('invalid-mail');
}

// unconfirmed なアカウント情報をすべて取得
try {
	$stmt 	= $dbh->prepare('SELECT "ID","UserID","Hashed" FROM "Account" WHERE "Email"=:email AND "State"=:unconfirmed AND "Type"=:hackforplay');
	$stmt->bindValue(":email", $email);
	$stmt->bindValue(":unconfirmed", "unconfirmed");
	$stmt->bindValue(":hackforplay", "hackforplay");
	$stmt->execute();
	$result	= $stmt->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
	print_r($e);
	die();
}

// いずれかに整合するなら、AccountIDを保存する
$confirmed = NULL;
foreach ($result as $key => $value) {
	if(password_verify($password, $value['Hashed'])){
		$confirmed = $value;
		break;
	}
}
if($confirmed == NULL){
	exit("invalid-passoword");
}


// セッションを作成
session_start();
$_SESSION['UserID'] = $confirmed['UserID'];

session_write_close();

// アカウントのStateをconnectedに
try {
	$stmt	= $dbh->prepare('UPDATE "Account" SET "State"=:connected WHERE "ID"=:confirmed_id');
	$stmt->bindValue(":connected", "connected");
	$stmt->bindValue("confirmed_id", $confirmed['ID'], PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if(!$flag){
		exit("valid-but-failed");
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// 同じメールアドレスで作られたHackforPlayアカウントのすべての unconfirmed なアカウントを disconnected に
try {
	$stmt	= $dbh->prepare('UPDATE "Account" SET "State"=:disconnected WHERE "Type"=:hackforplay AND "email"=:email AND "State"=:unconfirmed');
	$stmt->bindValue(":disconnected", "disconnected");
	$stmt->bindValue(":hackforplay", "hackforplay");
	$stmt->bindValue(":email", $email);
	$stmt->bindValue(":unconfirmed", "unconfirmed");
	$stmt->execute();

} catch (PDOException $e) {
	print_r($e);
	die();
}

exit("success");

 ?>