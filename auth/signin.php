<?php
/*
ペーパーログインIDまたはメールアドレス とパスワードをPOSTで取得し、サインインを行う
Input:
{
	id: ペーパーログインIDまたはメールアドレス,
	password: パスワード,
	// ref: もといたページのURL
}
Successed:	もといたページに遷移する
Failed:		ログイン専用ページに移動する
*/

try {

	require_once '../preload.php';

	$email 	= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
	if($email === FALSE || $email === NULL){
		exit('invalid-email');
	}
	$password = filter_input(INPUT_POST, 'password');

	// Emailよりアカウントを確認
	$stmt 	= $dbh->prepare('SELECT "ID","UserID","Hashed" FROM "Account" WHERE "Email"=:email AND "Type"=:hackforplay AND "State"=:connected');
	$stmt->bindValue(":email", $email);
	$stmt->bindValue(":hackforplay", "hackforplay");
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

	// サインイン成功
	header('Location: ' . $_SERVER['HTTP_REFERER']);

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);

	header('Location: ../e');
}

?>