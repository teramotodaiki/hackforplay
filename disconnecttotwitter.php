<?php
/*
Twitterとの連携を解除する
Input:	user_id
*/

require_once 'common.php';
require_once 'twitteroauth/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

try {
	require_once 'preload.php';

	session_start();
	$access_token = $_SESSION['access_token'];

	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

	$twitter = $connection->get("account/verify_credentials");

	// Accountと照合
	$stmt	= $dbh->prepare('SELECT "ID","UserID" FROM "Account" WHERE "Type"=:twitter AND "ExternalID"=:twitter_id AND "State"=:connected');
	$stmt->bindValue(":twitter", 'twitter', PDO::PARAM_STR);
	$stmt->bindValue(":twitter_id", $twitter->id, PDO::PARAM_INT);
	$stmt->bindValue(":connected", 'connected', PDO::PARAM_STR);
	$stmt->execute();

	$user	= $stmt->fetch(PDO::FETCH_ASSOC);

	// 存在確認・パラメータと照合
	$request_user_id	= filter_input(INPUT_GET, 'user_id');

	if ($user && $user['UserID'] === $request_user_id) {
		// 照合
		$stmt	= $dbh->prepare('UPDATE "Account" SET "State"=:disconnected WHERE "ID"=:account_id');
		$stmt->bindValue(":disconnected", 'disconnected', PDO::PARAM_STR);
		$stmt->bindValue(":account_id", $user['ID'], PDO::PARAM_INT);
		$stmt->execute();
	}

	// ログアウト
	unset($_SESSION['UserID']);
	setcookie(session_name(), '', time() - 1);
	session_destroy();
	session_commit();

	// 認証後のコールバックURL
	header('Location: /');

} catch (Exception $e) {
	require_once 'exception/tracedata.php';
	traceData($e);

	header('Location: e');
}
 ?>