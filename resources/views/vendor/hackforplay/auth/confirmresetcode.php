<?php
/*
メールで送信した確認コードを照会し、セッションを作成する
Input:	email , code
Output:	invalid-email , incorrect-code , already-expired , success
*/

require_once '../preload.php';

// 確認コードを取得
$email 		= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
if ($email === NULL || $email === FALSE) {
	exit('invalid-email');
}
$code 		= filter_input(INPUT_POST, 'code');
if ($code === NULL) {
	exit('incorrect-code');
}

$stmt	= $dbh->prepare('SELECT "ID","UserID","Hashed","Expired" FROM "AuthorizeRequest" WHERE "Email"=:email AND "State"=:unused');
$stmt->bindValue(":email", $email, PDO::PARAM_STR);
$stmt->bindValue(":unused", 'unused', PDO::PARAM_STR);
$stmt->execute();
$requests	= $stmt->fetchAll(PDO::FETCH_ASSOC);
if (empty($requests)) {
	exit('invalid-email');
}

// 照会
$authorized = NULL;
foreach ($requests as $key => $value) {
	if (password_verify($code, $value['Hashed'])) {
		$authorized	= $value;
		break;
	}
}
if ($authorized === NULL) {
	exit('incorrect-code');
}
if ($authorized['Expired'] < gmdate('Y-m-d H:i:s')) {
	exit('already-expired');
}

// セッションを作成
session_start();
$_SESSION['UserID'] = $authorized['UserID'];
$_SESSION['SignupImmediately'] = 'immediately';

session_commit();

$stmt	= $dbh->prepare('UPDATE "AuthorizeRequest" SET "State"=:used WHERE "ID"=:authorized_id');
$stmt->bindValue(":used", 'used', PDO::PARAM_STR);
$stmt->bindValue(":authorized_id", $authorized['ID'], PDO::PARAM_INT);
$stmt->execute();

exit('success');

?>
