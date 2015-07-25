<?php
/*
ペーパーログインアカウントでサインインを行う。新しくセッションをつくる
Input:	id , password
Output:	unregistered , incorrect-password , success
*/

require_once '../preload.php';

try {

	$id 	= filter_input(INPUT_POST, 'id');
	$password = filter_input(INPUT_POST, 'password');

	// Emailよりアカウントを確認
	$stmt 	= $dbh->prepare('SELECT "ID","UserID","Hashed" FROM "Account" WHERE "Email"=:id AND "Type"=:paperlogin AND "State"=:connected');
	$stmt->bindValue(":id", $id);
	$stmt->bindValue(":paperlogin", "paperlogin");
	$stmt->bindValue(":connected", "connected");
	$stmt->execute();
	$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
	if($result === NULL){
		exit("unregistered");
	}

	// パスワードを照会する
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

	// セッションをつくる
	session_start();
	$_SESSION['UserID'] = $confirmed['UserID'];
	session_commit();

	exit("success");

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>
