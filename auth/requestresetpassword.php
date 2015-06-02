<?php
/*
セッション不要。コードを生成し、パスワードの再設定をリクエストするメールを送信する
Input:	email , (attendance-token)
Output:	invalid-email , database-error , success
code: 6桁の数値 [100000-999999]
*/

require_once '../preload.php';

try {

	// アカウントの照会
	$email 		= filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
	if ($email === NULL || $email === FALSE) {
		exit('invalid-email');
	}

	$stmt		= $dbh->prepare('SELECT "UserID" FROM "Account" WHERE "Type"=:hackforplay AND "State"=:connected AND "Email"=:email');
	$stmt->bindValue(":hackforplay", 'hackforplay', PDO::PARAM_STR);
	$stmt->bindValue(":connected", 'connected', PDO::PARAM_STR);
	$stmt->bindValue(":email", $email, PDO::PARAM_STR);
	$stmt->execute();
	$account	= $stmt->fetch(PDO::FETCH_ASSOC);
	if (empty($account)) {
		exit('invalid-email');
	}
	$userid 	= $account['UserID'];

	// コードの生成
	$code		= (string)mt_rand(100000, 999999); // [100000-999999]
	$hashed		= password_hash($code, PASSWORD_DEFAULT);
	$registered	= (new DateTime())->format('Y-m-d H:i:s');
	$expired	= (new DateTime())->modify('+1 day')->format('Y-m-d H:i:s');

	$stmt	= $dbh->prepare('INSERT INTO "AuthorizeRequest" ("UserID","Email","Hashed","State","Registered","Expired") VALUES(:userid,:email,:hashed,:unused,:registered,:expired)');
	$stmt->bindValue(":userid", $userid, PDO::PARAM_INT);
	$stmt->bindValue(":email", $email, PDO::PARAM_STR);
	$stmt->bindValue(":hashed", $hashed, PDO::PARAM_STR);
	$stmt->bindValue(":unused", 'unused', PDO::PARAM_STR);
	$stmt->bindValue(":registered", $registered, PDO::PARAM_STR);
	$stmt->bindValue(":expired", $expired, PDO::PARAM_STR);
	$flag	= $stmt->execute();
	if (!$flag) {
		exit('database-error');
	}

	// メールの送信
	require_once 'sendmail.php';
	$sendGridMail	= createNewMail();
	$sendGridMail
	    ->addTo($email)
	    ->setFrom('noreply@hackforplay.xyz')
	    ->setSubject('パスワードのリセット - HackforPlay')
	    ->setText('確認コード：' . $code)
	    ->setHtml('確認コード： <strong>' . $code . '</strong><br>');
	trySending($sendGridMail);

	exit('success');

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>