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
	$stmt 	= $pdo->prepare('SELECT "Type" FROM "Account" WHERE "Type"=:Type AND "Email"=:Email AND "State"=:connected');
	$stmt->bindValue(":Type", "email", PDO::PARAM_STR);
	$stmt->bindValue(":Email", $email, PDO::PARAM_STR);
	$stmt->bindValue(":connected", "connected", PDO::PARAM_STR);
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
$to      = $email;
$subject = date("s").'メールアドレスの登録 - HackforPlay';
$message =
	// 'こんにちは。ハックフォープレイ開発者の寺本大輝です！' .
	// 'このメールは、 https://hackforplay.xyz にご入力いただいたメールアドレスに対して送信されています。' .
	// 'このまま登録する場合は、次の仮パスワードをハックフォープレイで入力するか、リンクにアクセスしてください。' .
	'仮パスワード：' . $tmpkey . '' .
	'リンク：（準備中）' . date("s");
$headers = 'From: admin@hackforplay.xyz \r\n' . 'X-Mailer: PHP/' . phpversion();

$result = mb_send_mail($to, $subject, $message, $headers);
if(!$result){
	die("sendmail-error");
}

// ユーザーを追加
try {
	$stmt 	= $pdo->prepare('INSERT INTO "user" ("beta","begin") VALUES(:zero,:gmt)');
	$stmt->bindValue(":zero", 0, PDO::PARAM_INT);
	$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s").date("P"));
	$stmt->execute();

	$userid = $pdo->lastInsertId('ID');
} catch (PDOException $e) {
	print_r($e);
	die();
}

// アカウントと関連づけ
try {
	$stmt 	= $pdo->prepare('INSERT INTO "Account" ("UserID","Type","State","Email","Hashed","Registered") VALUES(:userid,:hackforplay,:unconfirmed,:email,:hashed,:gmt)');
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

echo "success";

 ?>