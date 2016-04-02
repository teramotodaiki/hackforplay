<?php
// login
require_once 'common.php';
require_once 'twitteroauth/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

try {

	require_once 'preload.php';

	session_start();

	//TwitterOAuth をインスタンス化
	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);

	//コールバックURLをセット
	$request_token = $connection->oauth('oauth/request_token', array('oauth_callback' => OAUTH_CALLBACK));

	//callback.phpで使うのでセッションに入れる
	$_SESSION['oauth_token'] = $request_token['oauth_token'];
	$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];

	//Twitter.com 上の認証画面のURLを取得( この行についてはコメント欄も参照 )
	$url = $connection->url('oauth/authenticate', array('oauth_token' => $request_token['oauth_token']));

	// 認証後のコールバック( callback.phpのあと )をセッションに保持
	$authed_callback = filter_input(INPUT_GET, 'authed');
	$_SESSION['authed_callback_url'] = $authed_callback ? $authed_callback : '/';

	// loginsccessのあとに遷移するコールバックをセッションに保持
	$loginsuccessed_url = filter_input(INPUT_GET, 'login_successed');
	$_SESSION['loginsuccessed_callback_url'] = $loginsuccessed_url ? $loginsuccessed_url : '/';

	//Twitter.com の認証画面へリダイレクト
	header( 'location: '. $url );
	exit;

} catch (Exception $e) {
	header('Location: e');
	throw $e;
	die;
}
