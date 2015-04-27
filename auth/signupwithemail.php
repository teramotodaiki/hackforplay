<?php
/*
メールを送信したのち、新しくユーザーを作成し、アカウントを関連づける
Input: 	mail
Output: invalid , success, reserved , sendmail-error のいずれか
*/

require_once '../preload.php';

$email 	= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if($email == FALSE){
	exit('invalid');
}

// 同じメールアドレスでアカウントが作られていないか
try {
	$stmt 	= $dbh->prepare('SELECT "Type" FROM "Account" WHERE "Type"=:hackforplay AND "Email"=:email AND "State"=:connected');
	$stmt->bindValue(":hackforplay", "hackforplay");
	$stmt->bindValue(":email", $email);
	$stmt->bindValue(":connected", "connected");
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	if($result != NULL){
		exit("reserved");
	}
} catch (PDOException $e) {
	print_r($e);
	die();
}

// 仮パスワードを生成する
$bytes 	= openssl_random_pseudo_bytes(8); // 8bytes (16chars)
$tmpkey	= bin2hex($bytes); // binaly to hex
$hashed = password_hash($tmpkey, PASSWORD_DEFAULT);

// メール送信
require_once 'sendmail.php';
mailWithSendGrid($email, $tmpkey, $encription_key);

// ユーザーを追加（このとき、ひとつのユーザーに複数の有効なHackforPlayアカウントが紐付かないように気をつける）
// セッション情報があれば、今後それを使って同じユーザーIDを使ってもよい
try {
	$stmt 	= $dbh->prepare('INSERT INTO "User" ("Age") VALUES(NULL)');
	$stmt->execute();

	$userid = $dbh->lastInsertId();
} catch (PDOException $e) {
	print_r($e);
	die();
}

// アカウントと関連づけ
try {
	$stmt 	= $dbh->prepare('INSERT INTO "Account" ("UserID","Type","State","Email","Hashed","Registered") VALUES(:userid,:hackforplay,:unconfirmed,:email,:hashed,:gmt)');
	$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
	$stmt->bindValue(":hackforplay", "hackforplay");
	$stmt->bindValue(":unconfirmed", "unconfirmed");
	$stmt->bindValue(":email", $email);
	$stmt->bindValue(":hashed", $hashed);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s").date("P"));
	$stmt->execute();
} catch (PDOException $e) {
	print_r($e);
	die();
}

exit("success");

 ?>