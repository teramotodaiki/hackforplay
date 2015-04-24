<?php
/*
HackforPlayアカウントでサインインを行う。新しくセッションをつくる
Input:	email , password
Output:	invalid-email , unregistered , incorrect-password , success
*/

require_once '../preload.php';

$email 	= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if($email == FALSE){
	exit('invalid-email');
}
$password = filter_input(INPUT_POST, 'password');

// Emailよりアカウントを確認
try {
	$stmt 	= $dbh->prepare('SELECT "ID","UserID","Hashed" FROM "Account" WHERE "Email"=:email AND "Type"=:hackforplay AND "State"=:connected');
	$stmt->bindValue(":email", $email);
	$stmt->bindValue(":hackforplay", "hackforplay");
	$stmt->bindValue(":connected", "connected");
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	if($result == NULL){
		exit("unregistered");
	}

} catch (PDOException $e) {
	print_r($e);
	die();
}

// パスワードを照会する
$confirmed = NULL;
foreach ($result as $key => $value) {
	if(password_verify($password, $value['Hashed'])){
		$confirmed = $value;
		break;
	}
}
if($confirmed == NULL){
	exit("incorrect-password");
}

// セッションをつくる
session_start();
$_SESSION['UserID'] = $confirmed['UserID'];

exit("success");

 ?>
