<?php
/*
メールを送信したのち、新しくユーザーを作成し、アカウントを関連づける。NULLは許されない
Input: 	email , gender, nickname , password , birthday , experience_days , timezone_name , timezone_offset , timezone
Output: invalid , success, reserved , sendmail-error のいずれか
*/

require_once '../preload.php';

// Input value
$invalid_inputs = array();
$email				= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if ($email === FALSE || $email === NULL) {
	array_push($invalid_inputs, 'email');
}
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

var_dump($_POST);
die();

// Javascriptで取得したブラウザのタイムゾーン
$timezone = filter_input(INPUT_POST, 'timezone', FILTER_VALIDATE_REGEXP, array("options"=>array("regexp"=>"/^(\+|\-)[0-1][0-9]:00$/")));
if($timezone === FALSE || $timezone === NULL){
	$timezone = '+00:00';
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
	$stmt 	= $dbh->prepare('INSERT INTO "User" ("Registered") VALUES(:gmt)');
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone);
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
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . $timezone);
	$stmt->execute();
} catch (PDOException $e) {
	print_r($e);
	die();
}

exit("success");

 ?>