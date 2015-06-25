<?php
// login

require_once 'common.php';
require_once 'twitteroauth/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

try {
	//TwitterOAuth をインスタンス化
	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

	//コールバックURLをここでセット
	$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));

	//callback.phpで使うのでセッションに入れる
	require_once 'sessionsettings.php';
	session_start();
	$_SESSION['oauth_token'] = $request_token['oauth_token'];
	$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

	//Twitter.com 上の認証画面のURLを取得( この行についてはコメント欄も参照 )
	$url = $connection->url('oauth/authenticate', array('oauth_token' => $request_token['oauth_token']));

	//Twitter.com の認証画面へリダイレクト
	header( 'location: '. $url );

} catch (Exception $e) {
	require_once 'exception/tracedata.php';
	traceData($e);

	header('Location: e');
}

 ?>