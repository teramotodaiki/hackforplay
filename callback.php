<?php

require_once 'preload.php';

require_once 'common.php';
require_once 'twitteroauth/autoload.php';

use Abraham\TwitterOAuth\TwitterOAuth;

try {

	session_start();

	$request_token = [];
	$request_token['oauth_token'] = $_SESSION['oauth_token'];
	$request_token['oauth_token_secret'] = $_SESSION['oauth_token_secret'];

	if (isset($_REQUEST['oauth_token']) && $request_token['oauth_token'] !== $_REQUEST['oauth_token']) {
	    die( 'Error!' );
	}

	$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $request_token['oauth_token'], $request_token['oauth_token_secret']);

	$_SESSION['access_token'] = $connection->oauth("oauth/access_token", array("oauth_verifier" => $_REQUEST['oauth_verifier']));

	//セッションIDをリジェネレート
	session_regenerate_id();

	// 認証後のコールバックURL
	$callback_url = $_SESSION['authed_callback_url'];
	header('Location: ' . $callback_url);

} catch (Exception $e) {
	header('Location: e');
	throw $e;
	die;
}
?>
