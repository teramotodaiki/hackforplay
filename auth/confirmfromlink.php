<?php
/*
メールに埋め込まれたリンクから、Eメールアドレスとパスワードを認証する
認証できたら、 本登録を行う。認証に失敗した場合は、またモーダルを表示する
別のタブで開いてあるページに認証したことを伝えられるよう、ローカルストレージにデータを置く
Input:	email , encrypted_password
*/

require_once '../preload.php';

$email 	= filter_input(INPUT_GET, 'e', FILTER_VALIDATE_EMAIL);
if($email == FALSE){
	print_r('invalid email');
	exit();
}
$encrypted_password = filter_input(INPUT_GET, 'p');

// 復号化
$encrypted_dec = base64_decode($encrypted_password);
$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
$iv = substr($encrypted_dec, 0, $iv_size);
$encrypted = substr($encrypted_dec, $iv_size);
$password = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $encription_key, $encrypted, MCRYPT_MODE_CBC, $iv);

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

// いずれかに整合するなら、Accountを保存する
$confirmed = NULL;
foreach ($result as $key => $value) {
	if(password_verify($password, $value['Hashed'])){
		$confirmed = $value;
		break;
	}
}
if($confirmed == NULL){
	print_r('invalid password');
	exit();
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
?>
<!-- 暫定的にここにHTMLを置く -->
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title></title>
</head>
<body>
	<script type="text/javascript" charset="utf-8">
	localStorage.setItem('confirm-account-state', 'success');
	console.log(localStorage.getItem('confirm-account-state'));
	</script>
	<div>
		success
	</div>
</body>
</html>
