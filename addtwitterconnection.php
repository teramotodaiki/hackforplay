<?php

require_once 'common.php';
require_once 'twitteroauth/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

try {

	require_once 'preload.php';

	require_once 'sessionsettings.php';
	session_start();
	$access_token = $_SESSION['access_token'];

	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

	$twitter = $connection->get("account/verify_credentials");

	// Twitterアカウントの存在確認
	$stmt	= $dbh->prepare('SELECT "ID" FROM "Account" WHERE "Type"=:twitter AND "ExternalID"=:twitter_id AND "State"=:connected');
	$stmt->bindValue(":twitter", 'twitter', PDO::PARAM_STR);
	$stmt->bindValue(":twitter_id", $twitter->id, PDO::PARAM_INT);
	$stmt->bindValue(":connected", 'connected', PDO::PARAM_STR);
	$stmt->execute();
	$user	= $stmt->fetch(PDO::FETCH_ASSOC);

	// すでにアカウントが別のユーザーに関連付けられていないかどうかを確認
	// 関連付けがあった場合はエラーをHTMLで吐き出す
	if (!$user) {

		// セッションがあるかどうか確認
		if ($session_userid) {

			// アカウント作成してユーザーと紐付け
			$stmt	= $dbh->prepare('INSERT INTO "Account" ("UserID","Type","State","Email","Hashed","ExternalID","Registered") VALUES (:user_id,:twitter,:connected,:email,:hashed,:twitter_id,:gmt)');
			$stmt->bindValue(":user_id", $session_userid, PDO::PARAM_INT);
			$stmt->bindValue(":twitter", 'twitter', PDO::PARAM_STR);
			$stmt->bindValue(":connected", 'connected', PDO::PARAM_STR);
			$stmt->bindValue(":email", '', PDO::PARAM_STR);
			$stmt->bindValue(":hashed", '', PDO::PARAM_STR);
			$stmt->bindValue(":twitter_id", $twitter->id, PDO::PARAM_INT);
			$stmt->bindValue(":gmt", gmdate("Y-m-d H:i:s") . '+00:00', PDO::PARAM_STR);
			$stmt->execute();
		}

		session_commit();

		// 設定ページにもどる
		header('Location: /p');
	}

} catch (Exception $e) {
	require_once 'exception/tracedata.php';
	traceData($e);

	header('Location: e');
}

 ?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>エラー</title>
</head>
<body>
	<h1>エラー</h1>
	<p>お使いのTwitterアカウントは、すでに別のユーザーと連携されています。一度 <a href="loginwithtwitter.php?authed=%2Floginsuccess.php&login_successed=%2F" title="ログイン">ログイン</a>していただき、設定ページから「認証の解除」を行ってください。</p>
</body>
</html>
