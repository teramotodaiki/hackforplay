<?php
/*
メールに埋め込まれたリンクから、Eメールアドレスとパスワードを認証する
認証できたら、 本登録を行う。認証に失敗した場合は、またモーダルを表示する
Input:	email , encrypted_password
*/

require_once '../preload.php';

try {
	$email 	= filter_input(INPUT_GET, 'e', FILTER_VALIDATE_EMAIL);
	if($email === FALSE || $email === NULL){
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

	// disconnected でないアカウント情報をすべて取得
	$stmt 	= $dbh->prepare('SELECT "ID","UserID","Hashed","State" FROM "Account" WHERE "Email"=:email AND "State"!=:disconnected AND "Type"=:hackforplay');
	$stmt->bindValue(":email", $email);
	$stmt->bindValue(":disconnected", "disconnected");
	$stmt->bindValue(":hackforplay", "hackforplay");
	$stmt->execute();
	$result	= $stmt->fetchAll(PDO::FETCH_ASSOC);

	// すでに connected なアカウントがある場合
	foreach ($result as $key => $value) {
		if ($value["State"] === 'connected') {
			// セッションがあるなら、immediatelyにプロフィールを更新してもらう
			require_once 'inputview.php';
			exit();
		}
	}

	// いずれかに整合するなら、Accountを保存する
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

	// セッションを作成
	require_once '../sessionsettings.php';
	session_start();
	$_SESSION['UserID'] = $confirmed['UserID'];
	$_SESSION['SignupImmediately'] = 'immediately';

	session_commit();

	// アカウントのStateをconnectedに
	$stmt	= $dbh->prepare('UPDATE "Account" SET "State"=:connected WHERE "ID"=:confirmed_id');
	$stmt->bindValue(":connected", "connected");
	$stmt->bindValue("confirmed_id", $confirmed['ID'], PDO::PARAM_INT);
	$flag 	= $stmt->execute();
	if(!$flag){
		exit("valid-but-failed");
	}


	// 同じメールアドレスで作られたHackforPlayアカウントのすべての unconfirmed なアカウントを disconnected に
	$stmt	= $dbh->prepare('UPDATE "Account" SET "State"=:disconnected WHERE "Type"=:hackforplay AND "email"=:email AND "State"=:unconfirmed');
	$stmt->bindValue(":disconnected", "disconnected");
	$stmt->bindValue(":hackforplay", "hackforplay");
	$stmt->bindValue(":email", $email);
	$stmt->bindValue(":unconfirmed", "unconfirmed");
	$stmt->execute();

	require_once 'inputview.php';

} catch (Exception $e) {
	require_once '../exception/tracedata.php';
	traceData($e);
	die();
}
?>
